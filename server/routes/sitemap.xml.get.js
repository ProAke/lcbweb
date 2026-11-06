import { seedContent } from '../utils/content.js'
import { db } from '../utils/db.js'
export default defineEventHandler(async event=>{
  const base=(process.env.SITE_URL || 'https://www.laemchabanginterautotire.com').replace(/\/$/,'')
  let items=seedContent
  if(process.env.DATABASE_URL){const [rows]=await db().query("SELECT type,slug FROM content WHERE status='published' AND (type != 'promotion' OR ((starts_at IS NULL OR starts_at<=CURDATE()) AND (ends_at IS NULL OR ends_at>=CURDATE())))");items=rows}
  const paths=['/','/products','/services','/promotions','/articles','/about','/gallery','/contact','/privacy','/terms']
  const folders={product:'products',service:'services',promotion:'promotions',article:'articles'}
  for(const item of items) if(folders[item.type]) paths.push(`/${folders[item.type]}/${encodeURIComponent(item.slug)}`)
  const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
  setHeader(event,'Content-Type','application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${escape(base+path)}</loc></url>`).join('')}</urlset>`
})
