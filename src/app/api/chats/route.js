import { getSupabase } from '../../../lib/supabase';
import { getAuthEmail } from '../../../lib/auth';

// GET /api/chats — List user's chats
export async function GET(request) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getSupabase()
    .from('chats')
    .select('id, title, model, created_at, updated_at')
    .eq('user_email', email)
    .order('updated_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ chats: data });
}

// POST /api/chats — Create a new chat
export async function POST(request) {
  const email = getAuthEmail(request);
  if (!email) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title } = await request.json();

  const { data, error } = await getSupabase()
    .from('chats')
    .insert({
      user_email: email,
      title: title || 'New Chat',
    })
    .select('id, title, model, created_at, updated_at')
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ chat: data }, { status: 201 });
}
