import { getAuthEmail } from '../../../../../lib/auth';
import { getSupabase } from '../../../../../lib/supabase';
import { getAgentUrl, getAgentHeaders } from '../../../../../lib/agent';
import { extractAnswer, isResearchPending } from '../../../../../lib/extractAnswer';

/**
 * POST /api/research/[runId]/result
 *
 * Fetches the finished research result from the agent API,
 * extracts the answer text, saves it as an assistant message, and returns it.
 *
 * Body: { chatId: string }
 */
export async function POST(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { runId } = await params;
  const { chatId } = await request.json();
  if (!chatId) return Response.json({ error: 'chatId required' }, { status: 400 });

  // Verify chat ownership
  const { data: chat } = await getSupabase()
    .from('chats')
    .select('id')
    .eq('id', chatId)
    .eq('user_email', email)
    .single();
  if (!chat) return Response.json({ error: 'Chat not found' }, { status: 404 });

  // Fetch result from agent
  const agentRes = await fetch(`${getAgentUrl()}/research/${runId}`, {
    headers: getAgentHeaders(),
  });

  if (!agentRes.ok) {
    return Response.json(
      { error: `Agent returned ${agentRes.status}` },
      { status: agentRes.status }
    );
  }

  let data;
  try {
    data = await agentRes.json();
  } catch {
    return Response.json({ error: 'Invalid JSON from agent' }, { status: 502 });
  }

  if (isResearchPending(data)) {
    return Response.json(
      { error: 'Research still in progress', status: data.status },
      { status: 202 }
    );
  }

  const answerText = extractAnswer(data);
  if (!answerText) {
    console.error('[result/route] No answer found. Keys:', Object.keys(data));
    return Response.json({ error: 'No answer found in agent response' }, { status: 404 });
  }

  // Save assistant message to DB
  const { data: msg, error } = await getSupabase()
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      role: 'assistant',
      content: answerText,
      run_id: runId,
    })
    .select('id, role, content, run_id, created_at')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Update chat timestamp
  await getSupabase()
    .from('chats')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', chatId);

  return Response.json({ message: msg }, { status: 201 });
}
