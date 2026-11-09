import { db } from '../../utils/db.js'
import { checkOrigin, requireUser, audit } from '../../utils/security.js'
export default defineEventHandler(async event=>{
 checkOrigin(event); const user=await requireUser(event); const b=await readBody(event)
 const types=['banner','product','service','promotion','article','gallery','brand']
 if (!types.includes(b?.type) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b?.slug||'') || !b?.title?.trim() || !['draft','published'].includes(b?.status)) throw createError({statusCode:400,statusMessage:'Invalid fields: use a title and an English URL slug'})
 const validUrl = v => !v || (typeof v === 'string' && (/^https:\/\//i.test(v) || /^\/(?!\/)/.test(v)))
 if (!validUrl(b.image) || !validUrl(b.link)) throw createError({statusCode:400,statusMessage:'Image and link must be HTTPS or a local path'})
 const text=(v,max)=>String(v||'').slice(0,max)
 const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')?v:null
 if (b.starts_at && !date(b.starts_at) || b.ends_at && !date(b.ends_at) || b.starts_at && b.ends_at && b.starts_at>b.ends_at) throw createError({statusCode:400,statusMessage:'Invalid dates'})
 const fields=[b.type,text(b.slug,160),text(b.title,255),text(b.summary,5000),text(b.body,50000),text(b.image,2048),text(b.category,160),text(b.brand,160),text(b.link,2048),b.status,date(b.starts_at),date(b.ends_at),Number.isFinite(Number(b.sort_order))?Number(b.sort_order):0]
 let id=Number(b.id)||0
 try { if(id){ const [res]=await db().execute('UPDATE content SET type=?,slug=?,title=?,summary=?,body=?,image=?,category=?,brand=?,link=?,status=?,starts_at=?,ends_at=?,sort_order=? WHERE id=?',[...fields,id]); if(!res.affectedRows) throw createError({statusCode:404,statusMessage:'Not found'}) } else { const [res]=await db().execute('INSERT INTO content (type,slug,title,summary,body,image,category,brand,link,status,starts_at,ends_at,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',fields); id=res.insertId } } catch(e){ if(e.code==='ER_DUP_ENTRY') throw createError({statusCode:409,statusMessage:'Slug already exists for this type'}); throw e }
 await audit(user,'content.save',`${b.type}:${id}`); return {id}
})
