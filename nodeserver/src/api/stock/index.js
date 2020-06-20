import { Router } from 'express'
import { password as passwordAuth, master, token } from '../../services/passport'
import { bulkInsert, getStockData, getStoredStockData } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.put('/',
	token({ required: true }),
	getStockData)

router.post('/bulk',
	master(),
	bulkInsert)

router.get('/:id',
	token({ required: true }),
	getStoredStockData)

export default router