import { resInternal, resOk, resNoContent, resCreated } from '../../services/response/'
import mongoose from 'mongoose'
import { Company } from '.'
import { Stock } from '../stock/index'
import { User } from '../user/index'


export const create = ({ body }, res, next) => {
  Company.create({ ticker: body.ticker })
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

export const destroy = ({ params, user }, res, next) => {
  User.findById(user.id)
    .then(user => {
      if (!user) return next(resInternal('Failed to find user'))
      user.companies.splice(user.companies.indexOf(params.id), 1)
      return user.save();
    })
    .then(user => {
      if (!user) return next(resInternal('Failed to update user'))
      return Company.deleteOne({ _id: params.id})
    })
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

export const getCompanyByTicker = ({ body }, res, next) => {
  Company.findOne({ ticker: body.ticker })
    .then(company => {
      if (!company) return next(resInternal('Failed to find company'))
      return resOk(res, company.view(true))
    })
    .catch(next)
}