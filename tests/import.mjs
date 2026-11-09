import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'
const script='scripts/import-content.mjs'
const run=(...args)=>spawnSync(process.execPath,[script,...args],{encoding:'utf8'})
assert.match(execFileSync(process.execPath,[script,'--reference','--dry-run'],{encoding:'utf8'}),/Validated 10 records; status: draft/)
assert.equal(run('--file','data/legacy-products-page-1.csv','--dry-run').status,0)
const dir=mkdtempSync(join(tmpdir(),'lcb-import-'))
try {
 const file=join(dir,'test.json')
 const invalids=[
  [{type:'product',slug:'x',title:'X',price:99}],
  [{type:'product',slug:'x',title:'X',image:'javascript:alert(1)'}],
  [{type:'promotion',slug:'x',title:'X',starts_at:'2026-02-30'}],
  [{type:'product',slug:'x',title:'X'},{type:'product',slug:'x',title:'Y'}],
 ]
 for(const records of invalids){writeFileSync(file,JSON.stringify(records));assert.notEqual(run('--file',file,'--dry-run').status,0)}
 writeFileSync(file,JSON.stringify([{type:'promotion',slug:'x',title:'X'}]));assert.notEqual(run('--file',file,'--publish','--dry-run').status,0)
} finally {rmSync(dir,{recursive:true,force:true})}
console.log('Import validation tests passed.')
