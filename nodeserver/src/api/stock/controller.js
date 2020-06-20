import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Stock } from '.'

const axios = require('axios')

export const getStoredStockData = ({ params }, res, next) => {
	console.log('>>>>> params.id', params.id)
	Stock.find({ company: params.id })
		.sort('-date')
		.then(stocks => {
			if (!stocks) return next(resInternal('Failed to find stocks'))
			return resOk(res, stocks.map(s => s.view(true)))
		})
		.catch(next)
}

export const getStockData = async ({ body }, res, next) => {
	let stockList = []

	for (let company of body.companies) {
	 	let result = await fn(company.ticker)
	 	if (result && result.data) {
	 		stockList.push(result.data)
	 	}
	}

	let formattedStockList = []

	for (let i in stockList) {
		let stock = stockList[i]
		for (let a in stock['Time Series (Daily)']) {
			formattedStockList.push({
			company: body.companies[i]['id'],
			date: a,
			open: stock['Time Series (Daily)'][a]['1. open'],
			high: stock['Time Series (Daily)'][a]['2. high'],
			low: stock['Time Series (Daily)'][a]['3. low'],
			close: stock['Time Series (Daily)'][a]['4. close'],
			volume: stock['Time Series (Daily)'][a]['6. volume']
		})
		}
		
	}

	Stock.insertMany(formattedStockList)
	.then(stocks => {
		if (!stocks) return next(resInternal('Failed to create stocks'))
		return resCreated(res, stocks.map(s => s.view(true)))
	})
	.catch(next)

}

export const bulkInsert = ({ body }, res, next) => {
	Stock.insertMany(body.stockData)
		.then(stocks => {
			if (!stocks) return next(resInternal('Failed to create stocks'))
			return resCreated(res, stocks.map(s => s.view(true)))
		})
		.catch(next)
}

const fn = (company) => {
	return new Promise((resolve, reject) => {
		axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${company}&outputsize=full&apikey=W38AUXAONTSI5GQL`)
		.then(response => resolve(response))
		.catch(error => reject(error))		
	})
}