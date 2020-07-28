import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'

let d = undefined


export const create = ({ body, user }, res, next) => {
  let fields = {amount: body.amount, user: body.user, price: '', date: ''}
  createDate()
  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    fields.company = company.id
    return Stock.findOne({company: company.id, date: d})
  })
  .then(stock => {
    if (!stock) return next(resInternal('Failed to find stock'))
    fields.date = stock.date
    fields.price = stock.close
    return Share.create(fields)
  })
  .then(share => {
    if (!share) return next(resInternal('Failed to create share'))
    fields.id = share.id
    fields.company = body.ticker
    fields.user = user
    fields.cp = share.price
    fields.pp = 0
    fields.pa = 0
    return resCreated(res, fields)
  })
  .catch(next)
}

export const getShareByUserId = ({ user }, res , next) => {
  let gShares = undefined
  createDate()
  Share.find({user: user.id})
    .then(shares => {
      if (!shares) return next(resInternal('Failed to find shares'))
      gShares = shares
      let shareCompanyIds = []
      for (let share of shares) shareCompanyIds.push(share.company)
      return Stock.find({ company: {$in: shareCompanyIds}, date: d })
    })
    .then(async stocks => {
      if (!stocks) return next(resInternal('Failed to find stocks'))
      let finalSharesList = []
      for (let i in gShares) {
        let stock = stocks.find(s => s.company.equals(gShares[i].company))
        if (stock) {
          const { id, amount, price, date, user } = gShares[i]
          let cp = stock.close
          let pp = cp - price
          let pa = pp * amount
          
          let result = await findTicker(gShares[i].company)
          finalSharesList.push({ id: id, company: result.ticker, amount: amount, price: price, date: date, user: user, cp: cp, pp: pp.toFixed(2), pa: pa.toFixed(2) })
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

const findTicker = (companyId) => {
	return new Promise((resolve, reject) => {
		Company.findOne({_id: companyId})
		.then(response => resolve(response))
		.catch(error => reject(error))		
	})
}

const createDate = () => {
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  let a = 1

   if (today.getDay() === 6) a = 1
   if (today.getDay() === 0) a = 2
   if (today.getDay() === 1) a = 3

  d = new Date(today.setDate(today.getDate() - a))
  d = d.setMinutes(d.getMinutes() - today.getTimezoneOffset())
}