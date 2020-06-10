import { Router } from 'express'
import { password as passwordAuth, master, token } from '../../services/passport'
import { bulkInsert, getStockData } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.get('/',
	token({ required: true }),
	getStockData)

router.post('/bulk',
	master(),
	bulkInsert)

export default router