import { db } from '../../utils/db.js'
import { checkOrigin, tokenHash } from '../../utils/security.js'
export default defineEventHandler(async event => { checkOrigin(event); const token=getCookie(event,'lcb_session'); if(token) await db().execute('DELETE FROM sessions WHERE token_hash=?',[tokenHash(token)]); deleteCookie(event,'lcb_session',{path:'/'}); return {ok:true} })
