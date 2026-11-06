import { seedContent } from '../utils/content.js'
import { db } from '../utils/db.js'
export default defineEventHandler(async event => {
  const { type, slug } = getQuery(event)
  const types = ['banner','product','service','promotion','article','gallery','brand']
  if (type && !types.includes(type)) throw createError({statusCode:400,statusMessage:'Invalid type'})
  if (!process.env.DATABASE_URL) return seedContent.filter(i => (!type || i.type===type) && (!slug || i.slug===slug))
  let query = "SELECT id,type,slug,title,summary,body,image,category,brand,link,starts_at,ends_at,sort_order FROM content WHERE status='published' AND (type != 'promotion' OR ((starts_at IS NULL OR starts_at<=CURDATE()) AND (ends_at IS NULL OR ends_at>=CURDATE())))"
  const args=[]
  if (type) { query += ' AND type=?'; args.push(type) }
  if (slug) { query += ' AND slug=?'; args.push(slug) }
  query += ' ORDER BY sort_order ASC,id DESC'
  const [rows] = await db().execute(query,args)
  return rows
})
