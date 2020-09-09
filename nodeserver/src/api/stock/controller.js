import { resInternal, resOk, resCreated } from '../../services/response/'
import { Stock } from '.'
import { Company } from '../company/index'

const axios = require('axios')
const cheerio = require('cheerio')

export const getStoredStockData = ({ params }, res, next) => {
	console.log('getting stock data')
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

			let currentPrice = stock[0].close.toFixed(2)
			let previousPrice = stock[range].close
			let dollarIncrease = (currentPrice - previousPrice).toFixed(2)
			let percentageIncrease = (((currentPrice-previousPrice) / previousPrice) * 100).toFixed(2)
			dollarIncreaseList.push(dollarIncrease)
			percentIncreaseList.push(percentageIncrease)
		}
		increases.push({dollar: dollarIncreaseList, percentage: percentIncreaseList, currentPrice: stock[0].close.toFixed(2), currentVolume: stock[0].volume})
		dollarIncreaseList = []
		percentIncreaseList = []
	}
		return resOk(res, increases)
	})
	.catch(next)
}

export const getTechInds = async ({ query }, res, next) => {

	let gCompanies = []
	let topCompanies = []
	let unusualCompanies = []
	let newHighs = []
	let newLows = []
	let volatile = []
	let standardDev = -1

	try {
	  let companies = await Company.find()
	  if (!companies) return next(resInternal('Failed to find all companies'))
  
	  for (let i in companies) {
		let stocks = await Stock.find({ company: companies[i].ticker }).sort('-date')
		if (!stocks) continue

		let lastYear = []
		let prices = []
		for (let i = 0; i < 253; i++) {
			if (!stocks[i]) break
			lastYear.push(stocks[i])
			prices.push(stocks[i].close)
		}
		
		//volume stuff
		let volume = lastYear[0].volume
		let companyVolTotal = 0
		let companyVolAvg = -1
		let companyDevTotal = 0

		for (let stock of lastYear) companyVolTotal = companyVolTotal + stock.volume
		companyVolAvg = (companyVolTotal/lastYear.length).toFixed(0)
		for (let stock of lastYear) companyDevTotal = companyDevTotal + Math.abs(stock.volume-companyVolAvg)
		standardDev = (companyDevTotal/lastYear.length).toFixed(0)

		//new highs/lows
		if (stocks[0].close === Math.max(...prices)) newHighs.push({price: lastYear[0].close, percentChange: (((lastYear[0].close-lastYear[1].close)/lastYear[1].close)*100).toFixed(2), ticker: lastYear[0].company})
		if (stocks[0].close === Math.min(...prices)) newLows.push({price: lastYear[0].close, percentChange: (((lastYear[0].close-lastYear[1].close)/lastYear[1].close)*100).toFixed(2), ticker: lastYear[0].company})
		
		//company formatting
		let updatedCompany = { id: companies[i].id, ticker: companies[i].ticker, volume: volume, volumeAvg: companyVolAvg, standardDev: standardDev, price: lastYear[0].close, 
		percentChange: (((lastYear[0].close - lastYear[1].close)/lastYear[1].close)*100).toFixed(2), high: lastYear[0].high, low: lastYear[0].low }
		gCompanies.push(updatedCompany)
		topCompanies.push(updatedCompany)
		volatile.push(updatedCompany)
		}
		
		//top stocks
		let length = topCompanies.length
		let topGainers = [topCompanies[0], topCompanies[1], topCompanies[2]]
		let topLosers = [topCompanies[length-1], topCompanies[length-2], topCompanies[length-3]]

		//volume stuff again
	  gCompanies.sort(function(a, b){return b.volume-a.volume})
		for (let company of gCompanies) if (Number(company.volume) > Number(company.volumeAvg)+Number(standardDev*1.5)) unusualCompanies.push(company)

		//most volatile stuff
		volatile.sort(function(a, b) {return (b.high-b.low)-(a.high-a.low)})

	  return resOk(res, {unusual: unusualCompanies, active: [gCompanies[0], gCompanies[1], gCompanies[2]], gainers: topGainers, losers: topLosers, highs: newHighs, lows: newLows, volatile: [volatile[0], volatile[1], volatile[2] ]})

	} catch(error) {
		console.log('>>>> ERROR', error)
	}
}

export const webScrape = async () => {
	try {
		const baseURL = "https://en.wikipedia.org";
		const countriesURL = "/wiki/List_of_European_countries_by_population";
		const html = await axios.get(baseURL + countriesURL)

		const countriesMap = cheerio("tr > td:nth-child(2) > a", html.data)
			.map(async (index, element) => {
				console.log(element.children[0].data);
			})
			.get();
	} catch(error) {
		console.log('error: ', error);
	}
}