import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'

export const create = ({ body }, res, next) => {
  let fields = {ticker: body.ticker, amount: body.amount, date: body.date, user: body.user, price: ''}
  let companyId = ''

  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    companyId = company.id
    return Stock.findOne({company: companyId, date: new Date(body.date)})
  })
  .then(stock => {
    if (!stock) return next(resInternal('Failed to find stock'))
    fields.price = stock.open
    return Share.create(fields)
  })
  .then(share => {
    if (!share) return next(resInternal('Failed to create share'))
    return resCreated(res, share)
  })
  .catch(next)
}

export const getShareByUserId = ({ user }, res , next) => {
  Share.find({user: user.id})
    .then(shares => {
      if (!shares) return next(resInternal('Failed to find shares'))
      return resOk(res, shares)
    })
    .catch(next)
}

export const destroy = ({ params }, res, next) => {
  Share.deleteOne({_id: params.id})
    .then(share => {
      if (!share) return next(resInternal('Failed to delete share'))
      return resNoContent(res, 'No Content')
    })
}