import { NextRequest } from 'next/server';
import dns from 'dns';
import { createApiResponse } from '@/lib/server/apiResponse';

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function intToIpv4(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input = '' } = body;

    if (!input || typeof input !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'IP address or CIDR notation is required (e.g. 192.168.1.5/24 or 8.8.8.8).' },
        status: 400,
      });
    }

    const clean = input.trim();
    let ipPart = clean;
    let cidrBits = 32;

    if (clean.includes('/')) {
      const parts = clean.split('/');
      ipPart = parts[0];
      cidrBits = parseInt(parts[1], 10);
      if (isNaN(cidrBits) || cidrBits < 0 || cidrBits > 32) {
        return createApiResponse({
          error: { code: 'INVALID_CIDR', message: 'CIDR prefix must be a number between 0 and 32.' },
          status: 400,
        });
      }
    }

    // Validate IPv4 format
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ipPart)) {
      return createApiResponse({
        error: { code: 'INVALID_IP', message: `Invalid IPv4 format '${ipPart}'.` },
        status: 400,
      });
    }

    const octets = ipPart.split('.').map(Number);
    if (octets.some((o) => o < 0 || o > 255)) {
      return createApiResponse({
        error: { code: 'INVALID_IP', message: 'IP octets must be in range 0-255.' },
        status: 400,
      });
    }

    const ipInt = ipv4ToInt(ipPart);

    // IP Classification
    let classification = 'PUBLIC_INTERNET';
    let isPrivate = false;
    let isLoopback = false;
    let isLinkLocal = false;
    let isMulticast = false;

    if (octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168)) {
      classification = 'PRIVATE_NETWORK (RFC 1918)';
      isPrivate = true;
    } else if (octets[0] === 127) {
      classification = 'LOOPBACK (127.0.0.0/8)';
      isLoopback = true;
    } else if (octets[0] === 169 && octets[1] === 254) {
      classification = 'LINK_LOCAL (APIPA 169.254.0.0/16)';
      isLinkLocal = true;
    } else if (octets[0] >= 224 && octets[0] <= 239) {
      classification = 'MULTICAST (Class D)';
      isMulticast = true;
    } else if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) {
      classification = 'SHARED_CARRIER_NAT (RFC 6598)';
      isPrivate = true;
    }

    // Subnet calculation
    const maskInt = cidrBits === 0 ? 0 : (~0 << (32 - cidrBits)) >>> 0;
    const wildcardInt = ~maskInt >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidrBits);
    const usableHosts = cidrBits >= 31 ? (cidrBits === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsableInt = cidrBits >= 31 ? networkInt : networkInt + 1;
    const lastUsableInt = cidrBits >= 31 ? broadcastInt : broadcastInt - 1;

    // Reverse DNS PTR Lookup
    let reverseDns: string[] = [];
    if (!isPrivate && !isLoopback && !isLinkLocal) {
      try {
        reverseDns = await dns.promises.reverse(ipPart);
      } catch {
        // Reverse DNS lookup failed or nonexistent PTR
      }
    }

    return createApiResponse({
      data: {
        input: clean,
        ipAddress: ipPart,
        cidr: cidrBits,
        classification,
        isPrivate,
        isLoopback,
        isLinkLocal,
        isMulticast,
        subnet: {
          networkAddress: intToIpv4(networkInt),
          broadcastAddress: intToIpv4(broadcastInt),
          subnetMask: intToIpv4(maskInt),
          wildcardMask: intToIpv4(wildcardInt),
          firstUsableIp: intToIpv4(firstUsableInt),
          lastUsableIp: intToIpv4(lastUsableInt),
          totalHosts,
          usableHosts,
          binarySubnetMask: maskInt.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || '',
        },
        reverseDns: reverseDns.length > 0 ? reverseDns : ['No public PTR record configured.'],
        queriedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY IP & Subnet Intelligence Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Subnet calculation error: ${err.message}` },
      status: 500,
    });
  }
}
