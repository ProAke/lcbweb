import mysql from 'mysql2/promise'
import { seedContent, defaultSettings } from '../server/utils/content.js'
try { process.loadEnvFile() } catch {}
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env first')
const db = await mysql.createConnection(process.env.DATABASE_URL)
const statements = [
`CREATE TABLE IF NOT EXISTS content (id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, type VARCHAR(32) NOT NULL, slug VARCHAR(160) NOT NULL, title VARCHAR(255) NOT NULL, summary TEXT NOT NULL, body MEDIUMTEXT NOT NULL, image VARCHAR(2048) NOT NULL DEFAULT '', category VARCHAR(160) NOT NULL DEFAULT '', brand VARCHAR(160) NOT NULL DEFAULT '', link VARCHAR(2048) NOT NULL DEFAULT '', status ENUM('draft','published') NOT NULL DEFAULT 'draft', starts_at DATE NULL, ends_at DATE NULL, sort_order INT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY content_slug (type,slug), INDEX content_public (type,status,sort_order)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
`CREATE TABLE IF NOT EXISTS settings (name VARCHAR(100) PRIMARY KEY, value TEXT NOT NULL) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
`CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, role ENUM('admin','editor') NOT NULL DEFAULT 'editor', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
`CREATE TABLE IF NOT EXISTS sessions (token_hash CHAR(64) PRIMARY KEY, user_id INT UNSIGNED NOT NULL, expires_at DATETIME NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
`CREATE TABLE IF NOT EXISTS audit_log (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NULL, action VARCHAR(100) NOT NULL, details TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
]
for (const sql of statements) await db.query(sql)
for (const item of seedContent) await db.execute('INSERT IGNORE INTO content (type,slug,title,summary,body,image,category,brand,status,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)', [item.type,item.slug,item.title,item.summary,item.body,item.image,item.category,item.brand,item.status,item.sort_order])
for (const [name,value] of Object.entries(defaultSettings)) await db.execute('INSERT IGNORE INTO settings (name,value) VALUES (?,?)',[name,value])
console.log('Schema and starter content ready. Review starter content before publishing.')
await db.end()
