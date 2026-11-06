import { db } from '../../utils/db.js'
import { checkOrigin, requireUser, audit } from '../../utils/security.js'
export default defineEventHandler(async event=>{ checkOrigin(event); const user=await requireUser(event); const id=Number(getQuery(event).id); if(!Number.isInteger(id)||id<1) throw createError({statusCode:400}); const [r]=await db().execute('DELETE FROM content WHERE id=?',[id]); if(!r.affectedRows) throw createError({statusCode:404}); await audit(user,'content.delete',String(id)); return {ok:true} })
