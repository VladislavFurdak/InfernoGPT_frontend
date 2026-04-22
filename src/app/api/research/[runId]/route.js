import { getAuthEmail } from '../../../../lib/auth';
import { getAgentUrl, getAgentHeaders } from '../../../../lib/agent';

// GET /api/research/[runId] — Get result
export async function GET(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { runId } = await params;
  const res = await fetch(`${getAgentUrl()}/research/${runId}`, {
    headers: getAgentHeaders(),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

// DELETE /api/research/[runId] — Cancel research
export async function DELETE(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { runId } = await params;
  const res = await fetch(`${getAgentUrl()}/research/${runId}`, {
    method: 'DELETE',
    headers: getAgentHeaders(),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
