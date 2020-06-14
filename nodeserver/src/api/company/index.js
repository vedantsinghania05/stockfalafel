import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, index } from './controller'
import { schema } from './model'
export Company, { schema } from './model'

const router = new Router()

 router.post('/',
 master(),
 create)

 router.get('/',
 token({ required: true }),
 index)

 export default router
