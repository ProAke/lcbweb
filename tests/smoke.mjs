import assert from 'node:assert/strict'
const base=process.env.TEST_URL || 'http://127.0.0.1:3000'
const get = async path => fetch(base+path, {redirect:'manual'})
for(const path of ['/','/products','/products/passenger-tires','/services','/services/tire','/promotions','/articles','/about','/contact','/gallery','/privacy','/terms','/admin','/api/content','/api/settings','/sitemap.xml','/robots.txt']) {
 const response=await get(path); assert.equal(response.status,200,`${path}: expected 200, got ${response.status}`)
}
assert.equal((await get('/products/does-not-exist')).status,404)
assert.equal((await get('/api/content?type=invalid')).status,400)
assert.equal((await get('/api/admin/me')).status,401)
assert.equal((await fetch(base+'/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).status,403)
assert.equal((await get('/aboutus.php')).status,307)
console.log('Smoke tests passed (read-only preview).')
