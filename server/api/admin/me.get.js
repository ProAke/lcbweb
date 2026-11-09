import { requireUser } from '../../utils/security.js'
export default defineEventHandler(event=>requireUser(event))
