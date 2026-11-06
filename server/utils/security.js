import { createHash, randomBytes } from 'node:crypto'
import { db } from './db.js'
export const tokenHash = token => createHash('sha256').update(token).digest('hex')
export const newToken = () => randomBytes(32).toString('hex')
export function checkOrigin(event) {
  const origin = getHeader(event,'origin')
  const host = getHeader(event,'x-forwarded-host') || getHeader(event,'host')
  if (!origin || !host) throw createError({statusCode:403,statusMessage:'Origin required'})
  try { if (new URL(origin).host !== host) throw new Error() } catch { throw createError({statusCode:403,statusMessage:'Invalid origin'}) }
}
export async function requireUser(event, admin = false) {
  const token = getCookie(event,'lcb_session')
  if (!token) throw createError({statusCode:401,statusMessage:'Authentication required'})
  const [rows] = await db().execute('SELECT u.id,u.username,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>NOW()', [tokenHash(token)])
  if (!rows.length) throw createError({statusCode:401,statusMessage:'Session expired'})
  if (admin && rows[0].role !== 'admin') throw createError({statusCode:403,statusMessage:'Administrator required'})
  return rows[0]
}
export async function audit(user, action, details) { await db().execute('INSERT INTO audit_log (user_id,action,details) VALUES (?,?,?)',[user.id,action,details]) }
