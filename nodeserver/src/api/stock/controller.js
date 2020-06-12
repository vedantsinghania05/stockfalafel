import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Stock } from '.'

const axios = require('axios')
//let axiosInstance = axios.create();

export const getStockData = async ({ query }, res, next) => {
	let stockList = []

	var splitSymbols = query.company.split(",")

	for (let company of splitSymbols) {
	 	let result = await fn(company)
	 	if (result && result.data) {
	 		stockList.push(result.data)
	 	}
	}
	let formattedStockList = []

	for (let stock of stockList) {
		 for (let a in stock['Time Series (Daily)']) {
			 formattedStockList.push({
				symbol: stock['Meta Data']["2. Symbol"], 
				date: a,
				open: stock['Time Series (Daily)'][a]['1. open'],
				high: stock['Time Series (Daily)'][a]['2. high'],
				low: stock['Time Series (Daily)'][a]['3. low'],
				close: stock['Time Series (Daily)'][a]['4. close'],
				volume: stock['Time Series (Daily)'][a]['6. volume']
			})
		 }
		
	}
	console.log(formattedStockList)

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