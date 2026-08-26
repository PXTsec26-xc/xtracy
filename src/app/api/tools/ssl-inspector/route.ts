import { NextRequest } from 'next/server';
import tls from 'tls';
import { createApiResponse } from '@/lib/server/apiResponse';
import { validateUrlForSSRFAsync } from '@/lib/ssrfProtection';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { host = '', port = 443 } = body;

    if (!host || typeof host !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Target hostname or domain is required.' },
        status: 400,
      });
    }

    let cleanHost = host.trim().toLowerCase();
    if (cleanHost.startsWith('http://') || cleanHost.startsWith('https://')) {
      try {
        const u = new URL(cleanHost);
        cleanHost = u.hostname;
      } catch {
        cleanHost = cleanHost.replace(/^https?:\/\//, '').split('/')[0];
      }
    }
    cleanHost = cleanHost.split('/')[0].split(':')[0].trim();

    // Check SSRF
    const ssrfCheck = await validateUrlForSSRFAsync(`https://${cleanHost}`);
    if (!ssrfCheck.allowed) {
      return createApiResponse({
        error: { code: 'SSRF_RESTRICTED', message: ssrfCheck.reason || 'Restricted target domain.' },
        status: 400,
      });
    }

    const portNum = Number(port) || 443;

    const certData = await new Promise<any>((resolve, reject) => {
      const socket = tls.connect(
        {
          host: cleanHost,
          port: portNum,
          servername: cleanHost,
          rejectUnauthorized: false, // We inspect self-signed / expired certs too
          timeout: 5000,
        },
        () => {
          const cert = socket.getPeerCertificate(true);
          const cipher = socket.getCipher();
          const protocol = socket.getProtocol();
          const authorized = socket.authorized;
          const authError = socket.authorizationError;

          socket.end();

          if (!cert || Object.keys(cert).length === 0) {
            reject(new Error('No peer certificate presented by server.'));
          } else {
            resolve({ cert, cipher, protocol, authorized, authError });
          }
        }
      );

      socket.on('error', (err) => {
        reject(err);
      });

      socket.on('timeout', () => {
        socket.destroy();
        reject(new Error('TLS connection timed out after 5 seconds.'));
      });
    });

    const { cert, cipher, protocol, authorized, authError } = certData;

    const validFrom = new Date(cert.valid_from);
    const validTo = new Date(cert.valid_to);
    const now = new Date();

    const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = daysRemaining < 0;

    const altNames = cert.subjectaltname
      ? cert.subjectaltname.split(', ').map((n: string) => n.replace(/^DNS:/, ''))
      : [];

    return createApiResponse({
      data: {
        host: cleanHost,
        port: portNum,
        authorized,
        authError: authError ? String(authError) : null,
        protocolVersion: protocol,
        cipherSuite: cipher ? `${cipher.name} (${cipher.version})` : 'Standard TLS Cipher',
        subject: {
          commonName: cert.subject?.CN || cleanHost,
          organization: cert.subject?.O || 'Not specified',
          country: cert.subject?.C || 'Not specified',
        },
        issuer: {
          commonName: cert.issuer?.CN || 'Unknown CA',
          organization: cert.issuer?.O || 'Unknown Organization',
          country: cert.issuer?.C || 'Not specified',
        },
        validity: {
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining: Math.max(0, daysRemaining),
          isExpired,
          status: isExpired ? 'EXPIRED' : daysRemaining < 15 ? 'EXPIRING_SOON' : 'VALID',
        },
        fingerprints: {
          sha256: cert.fingerprint256 || 'SHA256-FINGERPRINT',
          sha1: cert.fingerprint || 'SHA1-FINGERPRINT',
          serialNumber: cert.serialNumber || 'N/A',
        },
        subjectAltNames: altNames,
        inspectedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Live TLS Handshake Inspector',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'TLS_ERROR', message: `TLS Certificate inspection failed: ${err.message}` },
      status: 500,
    });
  }
}
