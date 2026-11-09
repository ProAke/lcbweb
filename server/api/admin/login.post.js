import bcrypt from 'bcryptjs'
import { db } from '../../utils/db.js'
import { checkOrigin, newToken, tokenHash } from '../../utils/security.js'
const attempts = new Map()
export default defineEventHandler(async event => {
  checkOrigin(event)
  const ip = getRequestIP(event) || 'unknown'; const now = Date.now()
  const recent = (attempts.get(ip) || []).filter(t => now-t < 15*60*1000)
  if (recent.length >= 8) throw createError({statusCode:429,statusMessage:'Too many attempts; try again later'})
  const body = await readBody(event)
  const username = typeof body?.username === 'string' ? body.username.slice(0,100) : ''
  const password = typeof body?.password === 'string' ? body.password.slice(0,256) : ''
  const [users] = await db().execute('SELECT id,username,role,password_hash FROM users WHERE username=?',[username])
  const valid = await bcrypt.compare(password,users[0]?.password_hash || '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYhG6Ttxp3.vdNw7sA9.sUM9L3NjF8yK')
  if (!users.length || !valid) { attempts.set(ip,[...recent,now]); throw createError({statusCode:401,statusMessage:'Invalid credentials'}) }
  attempts.delete(ip)
  const token = newToken()
  await db().execute('INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,DATE_ADD(NOW(),INTERVAL 12 HOUR))',[tokenHash(token),users[0].id])
  setCookie(event,'lcb_session',token,{httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE==='true',path:'/',maxAge:43200})
  return {username:users[0].username,role:users[0].role}
})
