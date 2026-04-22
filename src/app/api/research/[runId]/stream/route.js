import { getAuthEmail } from '../../../../../lib/auth';
import { getAgentUrl, getAgentHeaders } from '../../../../../lib/agent';

// GET /api/research/[runId]/stream — Proxy SSE stream from agent
export async function GET(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { runId } = await params;
  const agentRes = await fetch(`${getAgentUrl()}/research/${runId}/stream`, {
    headers: getAgentHeaders({ Accept: 'text/event-stream' }),
  });

  if (!agentRes.ok) {
    return new Response(agentRes.statusText, { status: agentRes.status });
  }

  return new Response(agentRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
