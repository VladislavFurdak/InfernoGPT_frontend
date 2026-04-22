import { getSupabase } from '../../../../lib/supabase';
import { getAuthEmail } from '../../../../lib/auth';
import { getAgentUrl, getAgentHeaders } from '../../../../lib/agent';
import { extractAnswer } from '../../../../lib/extractAnswer';

// GET /api/chats/[chatId] — Get chat with messages
// Also recovers orphaned research results (browser closed before result saved)
export async function GET(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;

  // Verify ownership
  const { data: chat, error: chatError } = await getSupabase()
    .from('chats')
    .select('id, title, model, created_at')
    .eq('id', chatId)
    .eq('user_email', email)
    .single();

  if (chatError || !chat) {
    return Response.json({ error: 'Chat not found' }, { status: 404 });
  }

  let { data: messages, error: msgError } = await getSupabase()
    .from('chat_messages')
    .select('id, role, content, run_id, mode, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (msgError) return Response.json({ error: msgError.message }, { status: 500 });

  // Recovery: check if last message is from user with a run_id but no assistant follow-up.
  // This happens when the browser was closed before the result was saved.
  let pendingRunId = null;

  if (messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'user' && lastMsg.run_id) {
      try {
        const agentRes = await fetch(`${getAgentUrl()}/research/${lastMsg.run_id}`, {
          headers: getAgentHeaders(),
        });
        if (agentRes.ok) {
          const agentData = await agentRes.json();
          const answerText = extractAnswer(agentData);

          if (answerText) {
            // Research completed — save answer
            const { data: recovered } = await getSupabase()
              .from('chat_messages')
              .insert({
                chat_id: chatId,
                role: 'assistant',
                content: answerText,
                run_id: lastMsg.run_id,
              })
              .select('id, role, content, run_id, created_at')
              .single();

            if (recovered) {
              messages = [...messages, recovered];
            }
          } else {
            // Research still in progress — tell client to resume polling
            pendingRunId = lastMsg.run_id;
          }
        }
      } catch {
        // Agent unavailable — skip recovery
      }
    }
  }

  return Response.json({ chat, messages, pendingRunId });
}

// PATCH /api/chats/[chatId] — Update chat title
export async function PATCH(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;
  const { title } = await request.json();

  const updates = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;

  const { error } = await getSupabase()
    .from('chats')
    .update(updates)
    .eq('id', chatId)
    .eq('user_email', email);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

// DELETE /api/chats/[chatId] — Delete a chat (cascade deletes messages)
export async function DELETE(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;

  const { error } = await getSupabase()
    .from('chats')
    .delete()
    .eq('id', chatId)
    .eq('user_email', email);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
