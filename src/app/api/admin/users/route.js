import { getSupabase } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';

function checkAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

// GET — List all users
export async function GET(request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from('app_users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ users: data });
}

// POST — Create a new user
export async function POST(request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await getSupabase()
    .from('app_users')
    .insert({ email: email.toLowerCase().trim(), password_hash: passwordHash })
    .select('id, email, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ user: data }, { status: 201 });
}

// DELETE — Delete a user
export async function DELETE(request) {
  if (!checkAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { error } = await getSupabase()
    .from('app_users')
    .delete()
    .eq('id', id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
