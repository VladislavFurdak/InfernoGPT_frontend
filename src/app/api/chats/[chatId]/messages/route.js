import { getSupabase } from '../../../../../lib/supabase';
import { getAuthEmail } from '../../../../../lib/auth';

// POST /api/chats/[chatId]/messages — Add a message
export async function POST(request, { params }) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId } = await params;
  const { role, content, run_id, mode } = await request.json();

  // Verify ownership
  const { data: chat } = await getSupabase()
    .from('chats')
    .select('id')
    .eq('id', chatId)
    .eq('user_email', email)
    .single();

  if (!chat) return Response.json({ error: 'Chat not found' }, { status: 404 });

  const { data, error } = await getSupabase()
    .from('chat_messages')
    .insert({ chat_id: chatId, role, content, run_id: run_id || null, mode: mode || null })
    .select('id, role, content, run_id, mode, created_at')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Update chat timestamp and title if first user message
  const updates = { updated_at: new Date().toISOString() };
  if (role === 'user') {
    const { data: msgs } = await getSupabase()
      .from('chat_messages')
      .select('id')
      .eq('chat_id', chatId)
      .eq('role', 'user');
    if (msgs && msgs.length === 1) {
      updates.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    }
  }

  await getSupabase()
    .from('chats')
    .update(updates)
    .eq('id', chatId);

  return Response.json({ message: data }, { status: 201 });
}
