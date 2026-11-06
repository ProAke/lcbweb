import { db } from '../../utils/db.js'
import { requireUser } from '../../utils/security.js'
export default defineEventHandler(async event=>{await requireUser(event,true); const [users]=await db().query('SELECT id,username,role,created_at FROM users ORDER BY id');return users})
