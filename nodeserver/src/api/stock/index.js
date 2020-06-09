import { Router } from 'express'
import { password as passwordAuth, master, token } from '../../services/passport'
import { create } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.post('/',
	master(),
	create)

export default router