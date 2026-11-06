import mysql from 'mysql2/promise'
let pool
export function db() {
  if (!process.env.DATABASE_URL) throw createError({ statusCode: 503, statusMessage: 'Database is not configured' })
  if (!pool) pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 5, charset: 'utf8mb4' })
  return pool
}
