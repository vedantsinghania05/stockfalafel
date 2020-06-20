import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Company } from '.'

export const create = ({ body }, res, next) => {
  let fields = []
  for (let i in body.ticker) { fields.push({ ticker: body.ticker[i] }) }
  
  Company.deleteMany()
    .then(companies => {
      if (!companies) return next(resInternal('Failed to clear database'))
      return Company.insertMany(fields)
    })
    .then (companies => {
      if (!companies) return next(resInternal('Failed to create companies'))
      return resCreated(res, companies)
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
    console.log('>>>>>>', typeof mongoose.Types.ObjectId(companyId))
    usersCompanies.push(mongoose.Types.ObjectId(companyId))
  }

  console.log('usersCompanies >>>>>>>>>>', usersCompanies)

  Company.find({ _id: { $in: usersCompanies } })
    .then(companies => {
      console.log('>>>>>>>> companies',companies)
      if (!companies) return next(resInternal('Failed to find companies'))
      return resOk(res, companies.map(c => c.view(true)))
    })
    .catch(next)

  //Company.find({ id: { $in:  } })
}