import { resInternal, resOk, resCreated } from '../../services/response/'
import { Stock } from '.'
import { Company } from '../company/index'

const axios = require('axios')


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

export const getHighLow = ({ query }, res, next) => {
	let tickers = []
	let newHighs = []
	let newLows = []
	Company.find()
		.then(companies => {
			if (!companies) return next(resInternal('Failed to find companies'))
			for (let i of companies) tickers.push(i.ticker)
			return Stock.find()
		})
		.then(stocks => {
			if (!stocks) return next(resInternal('Failed to find stocks'))
			for (let i in tickers) {
				let stock = stocks.filter(s => s.company === tickers[i])
				if (stock) {
					let prices = []
					for (let i of stock) prices.push(i.close)
					if (stock[0].close === Math.max(...prices)) newHighs.push({type: 'New High', price: stock[0].close, percentChange: (((stock[0].close-stock[1].close)/stock[1].close)*100).toFixed(2), ticker: stock[0].company})
					if (stock[0].close === Math.min(...prices)) newLows.push({type: 'New Low', price: stock[0].close, percentChange: (((stock[0].close-stock[1].close)/stock[1].close)*100).toFixed(2), ticker: stock[0].company})

				}
			}
			return resOk(res, [newHighs, newLows])

		})
		.catch(next)
}

export const getTopGainingStocks = async ({ query }, res, next) => {
  let gCompanies = []
  try {
    let companies = await Company.find()
    if (!companies) return next(resInternal('Failed to find all companies'))

    for (let i in companies) {
      let stocks = await Stock.find({ company: companies[i].ticker }).sort('-date')
      if (!stocks) continue

      let percentageIncrease = ((stocks[0].close - stocks[1].close) / stocks[1].close) * 100
      let updatedCompany = { ticker: companies[i].ticker, percentChange: percentageIncrease.toFixed(2), price: stocks[0].close }
      gCompanies.push(updatedCompany)
    }

    gCompanies.sort(function(a, b){return b.percentChange-a.percentChange})

		let length = gCompanies.length
		let topGainers = [gCompanies[0], gCompanies[1], gCompanies[2]]
		let topLosers = [gCompanies[length-1], gCompanies[length-2], gCompanies[length-3]]
		
		for (let i of topGainers) i.type = 'Top Gainer'
		for (let i of topLosers) i.type = 'Top Loser'

    return resOk(res, [topGainers, topLosers])

  } catch(error) {
    console.log('>>>> ERROR', error)
  }

}

export const getUnusualVolumes = async ({ query }, res, next) => {

	let gCompanies = []
	let totalVol = 0
	let unusualCompanies = []

	try {
	  let companies = await Company.find()
	  if (!companies) return next(resInternal('Failed to find all companies'))
  
	  for (let i in companies) {
		let stocks = await Stock.find({ company: companies[i].ticker }).sort('-date')
		if (!stocks) continue
  
		let volume = stocks[0].volume
		totalVol = totalVol + volume

		let updatedCompany = { id: companies[i].id, ticker: companies[i].ticker, volume: volume }
		gCompanies.push(updatedCompany)
	  }
  
	  console.log('GCOMP>>>>>>>', gCompanies)
	  console.log('TOTALVOL>>>>', totalVol)

	  let volAvg = (totalVol / gCompanies.length).toFixed(0)
	  console.log('VOLAVG>>>>>>>', volAvg)
	  console.log('greater: ', volAvg*1.5, 'lesser: ', volAvg*0.5)

	  for (let company of gCompanies) {
		  if (company.volume > volAvg*1.5 || company.volume < volAvg*0.5) {
			  console.log('UNUSUAL: ', company.ticker, company.volume)
			  unusualCompanies.push(company)
		  }
	  }

	  return resOk(res, unusualCompanies)

	} catch(error) {
	  console.log('>>>> ERROR', error)
	}

}
