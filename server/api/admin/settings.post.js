import { db } from '../../utils/db.js'
import { checkOrigin, requireUser, audit } from '../../utils/security.js'
import { defaultSettings } from '../../utils/content.js'
export default defineEventHandler(async event=>{ checkOrigin(event); const user=await requireUser(event); const body=await readBody(event); for(const key of ['line','facebook','map']) { if(body?.[key] && !/^https:\/\//i.test(body[key])) throw createError({statusCode:400,statusMessage:'Links must use HTTPS'}) } for(const key of Object.keys(defaultSettings)){if(typeof body[key]==='string') await db().execute('INSERT INTO settings (name,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)',[key,body[key].slice(0,10000)])} await audit(user,'settings.save','website settings'); return {ok:true} })
