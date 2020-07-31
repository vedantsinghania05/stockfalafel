import { resInternal, resOk, resCreated } from '../../services/response/'
import { Stock } from '.'
import { Company } from '../company/index'

const axios = require('axios')


export const getStoredStockData = ({ params }, res, next) => {
	Stock.find({ company: params.ticker })
		.sort('-date')
		.then(stocks => {
			if (!stocks) return next(resInternal('Failed to find stocks'))
			return resOk(res, stocks.map(s => s.view(true)))
		})
		.catch(next)
}

export const getStockData = async ({ body }, res, next) => {
	let stockList = []
	let formattedStockList = []
	let invalidCompany = []

	let result = await fn(body.company.ticker)
	if (result && result.data) {
		if (result.data['Error Message']) invalidCompany = body.company.id
		else stockList.push(result.data)
	}

	for (let i in stockList) {
		let stock = stockList[i]
		for (let a in stock['Time Series (Daily)']) {
			formattedStockList.push({
			company: body.company.ticker,
			date: a,
			open: stock['Time Series (Daily)'][a]['1. open'],
			high: stock['Time Series (Daily)'][a]['2. high'],
			low: stock['Time Series (Daily)'][a]['3. low'],
			close: stock['Time Series (Daily)'][a]['4. close'],
			volume: stock['Time Series (Daily)'][a]['6. volume']
			})
		}
	}

	Company.deleteOne({_id: invalidCompany})
		.then(company => {
			if (!company) return next(resInternal('Failed to delete company'))
			return Stock.deleteMany({company: body.company.ticker })
		})
		.then(stocks => {
			if (!stocks) return next(resInternal('Failed to remove stocks'))
			return Stock.insertMany(formattedStockList)
		})
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

export const getPercentageIncreases = ({ body }, res, next) => {
	let dollarIncreaseList = []
	let percentIncreaseList = []
	let increases = []
	Stock.find({ company: {$in: body.tickers} })
	.sort('-date')
	.then(stocks => {
		if (!stocks) return next(resInternal('Failed to find stocks'))
		for (let i in body.tickers) {
		let stock = stocks.filter(s => s.company === body.tickers[i])

		for (let range of body.rangeList) {

			let currentPrice = stock[0].close
			let previousPrice = stock[range].close
			let dollarIncrease = (currentPrice - previousPrice).toFixed(2)
			let percentageIncrease = (((currentPrice-previousPrice) / previousPrice) * 100).toFixed(2)
			dollarIncreaseList.push(dollarIncrease)
			percentIncreaseList.push(percentageIncrease)
		}
		increases.push({dollar: dollarIncreaseList, percentage: percentIncreaseList})
		dollarIncreaseList = []
		percentIncreaseList = []
	}
		return resOk(res, increases)
	})
	.catch(next)
}
