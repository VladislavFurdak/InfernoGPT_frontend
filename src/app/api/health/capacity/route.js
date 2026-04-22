import { getAgentUrl, getAgentHeaders } from '../../../../lib/agent';

// Default: assume available when agent doesn't support /health/capacity yet
const DEFAULT_CAPACITY = {
  deep: { available: true, active: 0, max: 0 },
  fast: { available: true, active: 0, max: 0 },
};

// GET /api/health/capacity — Proxy capacity status from agent
export async function GET() {
  try {
    const res = await fetch(`${getAgentUrl()}/health/capacity`, {
      headers: getAgentHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      // Agent returned error (404 = endpoint not implemented yet) — assume available
      return Response.json(DEFAULT_CAPACITY);
    }
    const data = await res.json();
    return Response.json(data);
  } catch {
    // Agent unreachable — assume available (don't block UI)
    return Response.json(DEFAULT_CAPACITY);
  }
}
