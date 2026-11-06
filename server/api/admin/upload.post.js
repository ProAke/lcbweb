import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileTypeFromBuffer } from 'file-type'
import { checkOrigin,requireUser,audit } from '../../utils/security.js'
export default defineEventHandler(async event=>{checkOrigin(event);const user=await requireUser(event);const parts=await readMultipartFormData(event);const file=parts?.find(p=>p.name==='file');if(!file || file.data.length>5*1024*1024 || !file.data.length)throw createError({statusCode:400,statusMessage:'Image required (maximum 5MB)'});const kind=await fileTypeFromBuffer(file.data);if(!kind || !['image/jpeg','image/png','image/webp'].includes(kind.mime))throw createError({statusCode:400,statusMessage:'Only JPEG, PNG and WebP are allowed'});const dir=resolve(process.env.DATA_DIR||'.data','uploads');await mkdir(dir,{recursive:true});const name=`${randomUUID()}.${kind.ext}`;await writeFile(resolve(dir,name),file.data,{flag:'wx'});await audit(user,'media.upload',name);return {url:`/api/media/${name}`}})
