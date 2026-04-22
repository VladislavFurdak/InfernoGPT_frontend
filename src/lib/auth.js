/**
 * Extract user email from Bearer token in request headers.
 * Returns null if invalid/missing.
 */
export function getAuthEmail(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    if (payload.exp && payload.exp > Date.now()) {
      return payload.email;
    }
    return null;
  } catch {
    return null;
  }
}
