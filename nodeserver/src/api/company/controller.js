import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Company } from '.'
import { Stock } from '../stock/index'

const axios = require('axios')

export const create = async ({ body }, res, next) => {
  let fields = ({ ticker: body.ticker})

  let stockList = []
  let formattedStockList = []
  let gCompany = []

	 	let result = await fn(fields.ticker)
	 	if (result && result.data) {
			if (result.data['Error Message']) delete fields.ticker
      else stockList.push(result.data)
	 	}

  Company.create(fields)
  .then (company => {
    if (!company) return next(resInternal('Failed to create company'))

    gCompany = company

    for (let i in stockList) {
      let stock = stockList[i]
      for (let a in stock['Time Series (Daily)']) {
        formattedStockList.push({
        company: company._id,
        date: a,
        open: stock['Time Series (Daily)'][a]['1. open'],
        high: stock['Time Series (Daily)'][a]['2. high'],
        low: stock['Time Series (Daily)'][a]['3. low'],
        close: stock['Time Series (Daily)'][a]['4. close'],
        volume: stock['Time Series (Daily)'][a]['6. volume']
        })
      }
    }

    return Company.deleteOne({ ticker: null })
  })
  .then(company => {
    if (!company) return next(resInternal("Failed to delete ghosts"))
    return Stock.insertMany(formattedStockList)
  })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to create stocks'))
    return resCreated(res, gCompany)
  })  
  .catch(next)


}

export const index = ({ query }, res, next) => {
  Company.find()
    .then (companies => {
      if (!companies) return next(resInternal('Failed to find companies'))
      return resOk(res, companies)
    })
    .catch(next)
}

export const destroy = ({ params }, res, next) => {
  Company.deleteOne({ _id: params.id})
    .then(company => {
      if (!company) return next(resInternal('Failed to delete company'))
      return Stock.deleteMany({company: params.id})
    })
    .then(stocks => {
      if (!stocks) return next(resInternal('Failed to delete stocks'))
      return resNoContent(res, stocks)
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