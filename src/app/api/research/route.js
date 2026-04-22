import { getAuthEmail } from '../../../lib/auth';
import { getAgentUrl, getAgentHeaders } from '../../../lib/agent';

// POST /api/research — Start a research run
export async function POST(request) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const res = await fetch(`${getAgentUrl()}/research`, {
    method: 'POST',
    headers: getAgentHeaders(),
    body: JSON.stringify({
      query: body.query,
      mode: body.mode || 'deep',
    }),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
