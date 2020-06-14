import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Company } from '.'

export const create = ({ body }, res, next) => {
  let fields = []
  for (let i in body.ticker) { fields.push({ ticker: body.ticker[i] }) }
  Company.insertMany(fields)
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