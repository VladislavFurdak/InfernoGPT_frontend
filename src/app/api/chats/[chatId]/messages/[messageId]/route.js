import { getSupabase } from '../../../../../../lib/supabase';
import { getAuthEmail } from '../../../../../../lib/auth';

// PATCH /api/chats/[chatId]/messages/[messageId] — Update message (e.g. run_id)
export async function PATCH(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId, messageId } = await params;

  // Verify chat ownership
  const { data: chat } = await getSupabase()
    .from('chats')
    .select('id')
    .eq('id', chatId)
    .eq('user_email', email)
    .single();

  if (!chat) return Response.json({ error: 'Chat not found' }, { status: 404 });

  const body = await request.json();
  const updates = {};
  if (body.run_id !== undefined) updates.run_id = body.run_id;

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const { error } = await getSupabase()
    .from('chat_messages')
    .update(updates)
    .eq('id', messageId)
    .eq('chat_id', chatId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
