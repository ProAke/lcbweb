import { defaultSettings } from '../utils/content.js'
import { db } from '../utils/db.js'
export default defineEventHandler(async () => {
  if (!process.env.DATABASE_URL) return defaultSettings
  const [rows] = await db().query('SELECT name,value FROM settings')
  return { ...defaultSettings, ...Object.fromEntries(rows.map(r=>[r.name,r.value])) }
})
