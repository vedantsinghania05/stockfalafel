import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import mongoose from 'mongoose'
import { Company } from '.'
import { Stock } from '../stock/index'


export const create = ({ body }, res, next) => {
  let fields = ({ ticker: body.ticker})
  Company.create(fields)
    .then (company => {
      if (!company) return next(resInternal('Failed to create company'))
      return resCreated(res, company)
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