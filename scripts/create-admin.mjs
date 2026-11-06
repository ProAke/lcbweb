import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
try { process.loadEnvFile() } catch {}
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL first')
const username = process.env.ADMIN_USERNAME
const password = process.env.ADMIN_PASSWORD
if (!username || !password || password.length < 12 || password.length > 72) throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD (12 to 72 characters) in your environment')
const db = await mysql.createConnection(process.env.DATABASE_URL)
await db.execute('INSERT INTO users (username,password_hash,role) VALUES (?,?,?)',[username,await bcrypt.hash(password,12),'admin'])
await db.end()
console.log('Admin created. Clear ADMIN_PASSWORD from your environment.')
