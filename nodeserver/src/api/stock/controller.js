import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Stock } from '.'

const axios = require('axios')
//let axiosInstance = axios.create();

export const getStockData = async ({ query }, res, next) => {
	let stockList = []

	console.log('>>>>>>>>> companies', query)
	var splitSymbols = query.company.split(",")
	console.log(splitSymbols)

	 for (let company of splitSymbols) {
	 	let result = await fn(company)
	 	console.log('>>>> reuslt', result)
	 	if (result && result.data) {
	 		stockList.push(result.data)
	 	}
	 }
	 

	// post data here using stocklist :)x1000
	/*
 	data.push({
		symbol: response.data['Meta Data']["2. Symbol"], 
		date: a,
		open: response.data['Time Series (Daily)'][a]['1. open'],
		high: response.data['Time Series (Daily)'][a]['2. high'],
		low: response.data['Time Series (Daily)'][a]['3. low'],
		close: response.data['Time Series (Daily)'][a]['4. close'],
		volume: response.data['Time Series (Daily)'][a]['6. volume']
	})
	*/

	// console.log('>>>>>>>>>> stocks', stockList[0]['Meta Data'])
	// return resOk(res, stockList)
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