import { db } from '../../utils/db.js'
import { requireUser } from '../../utils/security.js'
export default defineEventHandler(async event=>{ await requireUser(event); const [rows]=await db().query('SELECT * FROM content ORDER BY updated_at DESC,id DESC'); return rows })
