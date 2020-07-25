import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'

export const create = ({ body }, res, next) => {
  let fields = {amount: body.amount, user: body.user, price: '', date: ''}

  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    fields.company = company.id
    return Stock.find({company: company.id})
  })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to find stock'))
    fields.date = stocks[0].date
    fields.price = stocks[0].close
    return Share.create(fields)
  })
  .then(share => {
    if (!share) return next(resInternal('Failed to create share'))
    return resCreated(res, share)
  })
  .catch(next)
}

export const getShareByUserId = async ({ user }, res , next) => {
  let gShares = undefined
  Share.find({user: user.id})
    .then(shares => {
      gShares = shares
      let shareCompanyIds = []
      for (let share of shares) shareCompanyIds.push(share.company)
      return Company.find({ _id: {$in: shareCompanyIds} })
    })
    .then(companies => {
      if (!companies) return next(resInternal('Failed to find companies'))
      let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      let offset = today.getTimezoneOffset()
      let d = new Date(today.setDate(today.getDate() - 1))
      d = d.setMinutes(d.getMinutes() - offset)
      let companyIds = []
      for (let company of companies) companyIds.push(company._id)
      return Stock.find({ company: {$in: companyIds}, date: d })
    })
    .then(stocks => {
      let finalSharesList = []
      for (let i in gShares) {
        let stock = stocks.find(s => s.company.equals(gShares[i].company))
        if (stock) {
          const { id, company, amount, price, date, user } = gShares[i]

          let cp = stock.close
          let pp = cp - price
          let pa = pp * amount

          finalSharesList.push({ id: id, company: company, amount: amount, price: price, date: date, user: user, cp: cp, pp: pp, pa: pa })
        } 
      }
      return resOk(res, finalSharesList)

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