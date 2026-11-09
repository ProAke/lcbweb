import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { parse } from 'csv-parse/sync'
import mysql from 'mysql2/promise'
import { referenceProducts } from '../server/utils/reference-products.js'

// Only explicitly supported columns are accepted: unknown columns such as price
// or quantity must be reviewed instead of being silently discarded.
const allowed = new Set(['type','slug','title','summary','body','image','category','brand','link','starts_at','ends_at','sort_order'])
const types = new Set(['product','service','article','gallery','brand','banner','promotion'])
const argv=process.argv.slice(2)
const help='Usage: node scripts/import-content.mjs (--reference | --file <csv-or-json>) [--dry-run] [--publish]'
if (argv.includes('--help')) { console.log(help); process.exit(0) }
const fileAt=argv.indexOf('--file')
if (argv.some((v,i)=>!['--reference','--file','--dry-run','--publish'].includes(v) && !(fileAt>=0 && i===fileAt+1)) || (argv.includes('--reference') === (fileAt>=0)) || (fileAt>=0 && (!argv[fileAt+1] || argv[fileAt+1].startsWith('--')))) throw new Error(help)
let records
if (argv.includes('--reference')) records=referenceProducts.map(({status,...r})=>r)
else {
  const file=argv[fileAt+1], text=await readFile(file,'utf8'), ext=extname(file).toLowerCase()
  if(ext==='.json') records=JSON.parse(text.replace(/^\uFEFF/,''))
  else if(ext==='.csv') records=parse(text,{columns:true,bom:true,skip_empty_lines:true,trim:true,relax_column_count:false})
  else throw new Error('Input must be a .csv or .json file')
}
if(!Array.isArray(records) || !records.length) throw new Error('Input must contain at least one record')
const seen=new Set()
const text = (value,max,field,row) => { if(value!==undefined && value!==null && typeof value!=='string' && typeof value!=='number') throw new Error(`Row ${row}: invalid ${field}`); const s=String(value??'').trim(); if(s.length>max) throw new Error(`Row ${row}: ${field} exceeds ${max} characters`); return s }
const validDate = value => { if(!value)return true; if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false; const d=new Date(`${value}T00:00:00Z`); return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10)===value }
const normalized=records.map((r,index)=>{
 const n=index+1
 if(!r || Array.isArray(r) || typeof r!=='object') throw new Error(`Row ${n}: expected an object`)
 for(const key of Object.keys(r)) if(!allowed.has(key)) throw new Error(`Row ${n}: unsupported column ${key}; review and map the export first`)
 const type=text(r.type,32,'type',n),slug=text(r.slug,160,'slug',n),title=text(r.title,255,'title',n)
 if(!types.has(type) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title) throw new Error(`Row ${n}: valid type, English slug and title are required`)
 const key=`${type}:${slug}`; if(seen.has(key))throw new Error(`Row ${n}: duplicate ${key}`); seen.add(key)
 const summary=text(r.summary,5000,'summary',n),body=text(r.body,50000,'body',n),image=text(r.image,2048,'image',n),category=text(r.category,160,'category',n),brand=text(r.brand,160,'brand',n),link=text(r.link,2048,'link',n)
 for (const [field,value] of [['image',image],['link',link]]) if(value && !/^https:\/\//i.test(value) && !/^\/(?![\/\\])/.test(value)) throw new Error(`Row ${n}: ${field} must be HTTPS or a local path`)
 const start=text(r.starts_at,10,'starts_at',n),end=text(r.ends_at,10,'ends_at',n)
 if(!validDate(start)||!validDate(end)||(start&&end&&start>end))throw new Error(`Row ${n}: invalid date range`)
 if(type==='promotion' && argv.includes('--publish') && (!start || !end))throw new Error(`Row ${n}: published promotions require start and end dates`)
 const order=r.sort_order===undefined||r.sort_order===''?0:Number(r.sort_order)
 if(!Number.isInteger(order)||order < -2147483648||order > 2147483647)throw new Error(`Row ${n}: invalid sort_order`)
 return [type,slug,title,summary,body,image,category,brand,link,argv.includes('--publish')?'published':'draft',start||null,end||null,order]
})
console.log(`Validated ${normalized.length} records; status: ${argv.includes('--publish')?'published':'draft'}.`)
if(argv.includes('--dry-run')) { console.log('Dry run only: no database connection or changes. Existing duplicates are checked during import.');process.exit(0) }
try {process.loadEnvFile()} catch {}
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required for import')
const connection=await mysql.createConnection(process.env.DATABASE_URL)
let inserted=0,skipped=0
try {
 await connection.beginTransaction()
 for(const row of normalized){
   const [exists]=await connection.execute('SELECT id FROM content WHERE type=? AND slug=?',[row[0],row[1]])
   if(exists.length){skipped++;continue}
   await connection.execute('INSERT INTO content (type,slug,title,summary,body,image,category,brand,link,status,starts_at,ends_at,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',row);inserted++
 }
 await connection.commit()
 console.log(`Inserted ${inserted}; skipped ${skipped} existing records. Existing content was not changed.`)
} catch(error){await connection.rollback();throw error} finally {await connection.end()}
