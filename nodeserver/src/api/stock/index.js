import { Router } from 'express'
import { token } from '../../services/passport'
import { getStockData, getStoredStockData, getPercentageIncreases, getTechInds, webScrape } from './controller'
import { schema } from './model'
export Stock, { schema } from './model'

const router = new Router()

router.put('/',
	token({ required: true }),
	getStockData)

router.get('/info/:ticker',
	token({ required: true }),
	getStoredStockData)

router.get('/volume',
	token({ required: true }),
	getTechInds)

router.put('/percentages', 
	token({ required: true }),
	getPercentageIncreases)

router.put('/scrape',
	token({required: true}),
	webScrape)

export default router