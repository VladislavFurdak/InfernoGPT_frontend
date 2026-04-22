import { getSupabase } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin';
const ADMIN_PASSWORD = '';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Admin hardcoded login
  if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = Buffer.from(JSON.stringify({
      userId: 'admin',
      email: 'admin',
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })).toString('base64');

    return Response.json({ ok: true, token, email: 'admin', role: 'admin' });
  }

  // Regular user login
  const { data: user, error } = await getSupabase()
    .from('app_users')
    .select('id, email, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !user) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = Buffer.from(JSON.stringify({
    userId: user.id,
    email: user.email,
    role: 'user',
    exp: Date.now() + 24 * 60 * 60 * 1000,
  })).toString('base64');

  return Response.json({ ok: true, token, email: user.email, role: 'user' });
}
