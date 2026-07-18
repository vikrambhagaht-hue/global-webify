const SECRET_KEY = process.env.JWT_SECRET;

async function getCryptoKey() {
  const secret = SECRET_KEY || null;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign', 'verify']
  );
}

export async function signJWT(payload: any, expiresInSeconds: number = 86400) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const enc = new TextEncoder();
  const tokenPayload = { ...payload, exp };
  
  const headerBase64 = btoa(JSON.stringify(header))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  const payloadBase64 = btoa(JSON.stringify(tokenPayload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  const data = enc.encode(`${headerBase64}.${payloadBase64}`);
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
  
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad === 2) {
    base64 += '==';
  } else if (pad === 3) {
    base64 += '=';
  } else if (pad === 1) {
    base64 += '===';
  }
  return atob(base64);
}

export async function verifyJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerBase64, payloadBase64, signatureBase64] = parts;
    
    const enc = new TextEncoder();
    const data = enc.encode(`${headerBase64}.${payloadBase64}`);
    
    const signatureStr = base64urlDecode(signatureBase64);
    const signatureBytes = new Uint8Array(signatureStr.split('').map(c => c.charCodeAt(0)));
    
    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, data);
    
    if (!isValid) return null;
    
    const payloadStr = base64urlDecode(payloadBase64);
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

