import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { createApiResponse } from '@/lib/server/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text = '', secret = '', compareHash = '' } = body;

    if (typeof text !== 'string') {
      return createApiResponse({
        error: { code: 'BAD_REQUEST', message: 'Input text string is required for hashing.' },
        status: 400,
      });
    }

    const md5 = crypto.createHash('md5').update(text, 'utf8').digest('hex');
    const sha1 = crypto.createHash('sha1').update(text, 'utf8').digest('hex');
    const sha256 = crypto.createHash('sha256').update(text, 'utf8').digest('hex');
    const sha384 = crypto.createHash('sha384').update(text, 'utf8').digest('hex');
    const sha512 = crypto.createHash('sha512').update(text, 'utf8').digest('hex');

    let hmacSha256 = '';
    if (secret) {
      hmacSha256 = crypto.createHmac('sha256', secret).update(text, 'utf8').digest('hex');
    }

    let isMatch = false;
    let matchedAlgorithm = '';

    if (compareHash) {
      const cleanCompare = compareHash.trim().toLowerCase();
      if (cleanCompare === md5) {
        isMatch = true;
        matchedAlgorithm = 'MD5';
      } else if (cleanCompare === sha1) {
        isMatch = true;
        matchedAlgorithm = 'SHA-1';
      } else if (cleanCompare === sha256) {
        isMatch = true;
        matchedAlgorithm = 'SHA-256';
      } else if (cleanCompare === sha384) {
        isMatch = true;
        matchedAlgorithm = 'SHA-384';
      } else if (cleanCompare === sha512) {
        isMatch = true;
        matchedAlgorithm = 'SHA-512';
      }
    }

    return createApiResponse({
      data: {
        textLength: text.length,
        hashes: {
          md5,
          sha1,
          sha256,
          sha384,
          sha512,
          hmacSha256: hmacSha256 || undefined,
        },
        verification: compareHash
          ? {
              isMatch,
              matchedAlgorithm: matchedAlgorithm || 'NO_MATCH',
              providedHash: compareHash,
            }
          : undefined,
        generatedAt: new Date().toISOString(),
      },
      dataTrust: {
        status: 'LIVE',
        sourceName: 'XTRACY Cryptographic Hash Engine',
        lastRefreshed: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return createApiResponse({
      error: { code: 'INTERNAL_ERROR', message: `Hashing failed: ${err.message || 'Processing error'}` },
      status: 500,
    });
  }
}
