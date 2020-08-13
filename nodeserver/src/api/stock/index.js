import { Router } from 'express'
import { token } from '../../services/passport'
import { getStockData, getStoredStockData, getPercentageIncreases, getHighLow, getTopGainingStocks, getUnusualVolumes } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.put('/',
	token({ required: true }),
	getStockData)

router.get('/info/:ticker',
	token({ required: true }),
	getStoredStockData)

router.get('/gainers',
	token({ required: true }),
	getTopGainingStocks)

router.get('/volume',
	token({ required: true }),
	getUnusualVolumes)

router.put('/percentages', 
	token({ required: true }),
	getPercentageIncreases)

router.get('/',
	token({required: true}),
	getHighLow)

export default router