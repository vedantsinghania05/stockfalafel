import { Router } from 'express'
import { password as passwordAuth, master, token } from '../../services/passport'
import { bulkInsert, getStockData, getStoredStockData, getPercentageIncreases } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.put('/',
	token({ required: true }),
	getStockData)

router.get('/:ticker',
	token({ required: true }),
	getStoredStockData)

router.put('/percentages', 
	token({ required: true }),
	getPercentageIncreases)

export default router