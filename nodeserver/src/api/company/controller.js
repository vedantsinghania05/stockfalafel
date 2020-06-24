import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Company } from '.'
import { Stock } from '../stock/index'

const axios = require('axios')

export const create = async ({ body }, res, next) => {
  let fields = []
  for (let i in body.ticker) { fields.push({ ticker: body.ticker[i] }) }

  let stockList = []
  let formattedStockList = []
  let gCompanies = []

	for (let i in fields) {
	 	let result = await fn(fields[i].ticker)
	 	if (result && result.data) {
			if (result.data['Error Message']) await fields.splice(i, 1)
			else stockList.push(result.data)
	 	}
  }
  console.log('>>>>>>>>>>> fields', fields)

  Company.deleteMany()
  .then(companies => {
    if (!companies) return next(resInternal('Failed to clear database'))
    return Company.insertMany(fields)
  })
  .then (companies => {
    if (!companies) return next(resInternal('Failed to create companies'))

    gCompanies = companies

    for (let i in stockList) {
      let stock = stockList[i]
      for (let a in stock['Time Series (Daily)']) {
        formattedStockList.push({
        company: companies[i]['id'],
        date: a,
        open: stock['Time Series (Daily)'][a]['1. open'],
        high: stock['Time Series (Daily)'][a]['2. high'],
        low: stock['Time Series (Daily)'][a]['3. low'],
        close: stock['Time Series (Daily)'][a]['4. close'],
        volume: stock['Time Series (Daily)'][a]['6. volume']
        })
      }
    }

    return Stock.deleteMany()
  })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to remove stocks'))
      return Stock.insertMany(formattedStockList)
    })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to create stocks'))
    return resCreated(res, gCompanies)
  })
  .catch(next)


}

export const index = ({ query }, res, next) => {
  Company.find()
    .then (companies => {
      if (!companies) return next(resInternal('Failed to find commpanies'))
      return resOk(res, companies)
    })
    .catch(next)
}

import mongoose from 'mongoose'

export const getUsersCompanies = ({ user }, res, next) => {
  let usersCompanies = []

  for (let companyId of user.companies) {
    usersCompanies.push(mongoose.Types.ObjectId(companyId))
  }

  Company.find({ _id: { $in: usersCompanies } })
    .then(companies => {
      if (!companies) return next(resInternal('Failed to find companies'))
      return resOk(res, companies.map(c => c.view(true)))
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