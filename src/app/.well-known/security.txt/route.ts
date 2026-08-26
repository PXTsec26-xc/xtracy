import { NextResponse } from 'next/server';

export async function GET() {
  const expiresDate = new Date();
  expiresDate.setFullYear(expiresDate.getFullYear() + 1);

  const securityTxtContent = `Contact: mailto:security@xtracy.org
Expires: ${expiresDate.toISOString()}
Preferred-Languages: en
Canonical: https://xtracy.org/.well-known/security.txt
Policy: https://xtracy.org/security
Hiring: https://xtracy.org/founder
`;

  return new NextResponse(securityTxtContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
