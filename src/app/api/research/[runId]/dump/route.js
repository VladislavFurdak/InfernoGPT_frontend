import { getAuthEmail } from '../../../../../lib/auth';
import { getAgentUrl, getAgentHeaders } from '../../../../../lib/agent';

// GET /api/research/[runId]/dump — Download full operation log as text
export async function GET(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return new Response('Unauthorized', { status: 401 });

  const { runId } = await params;
  const res = await fetch(`${getAgentUrl()}/research/${runId}/dump`, {
    headers: getAgentHeaders({ Accept: 'text/plain' }),
  });

  if (!res.ok) {
    return new Response(`Agent returned ${res.status}`, { status: res.status });
  }

  const text = await res.text();
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="research-${runId}.log"`,
    },
  });
}
