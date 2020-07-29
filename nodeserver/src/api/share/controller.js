import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'

let d = undefined


export const create = ({ body, user }, res, next) => {
  let fields = {amount: body.amount, user: body.user, price: body.price, date: body.date, company: body.ticker}
  let gStock = undefined
  createDate()
  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    return Stock.findOne({company: company.ticker, date: d})
  })
  .then(stock => {
    if (!stock) return next(resInternal('Failed to find stock'))
    gStock = stock
    return Share.create(fields)
  })
  .then(share => {
    if (!share) return next(resInternal('Failed to create share'))

    fields.volume = gStock.volume
    fields.id = share._id
    fields.cp = gStock.close
    fields.pa = (gStock.close-share.price)*share.amount
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
      let shareCompanyTickers = []
      for (let share of shares) shareCompanyTickers.push(share.company)
      return Stock.find({ company: {$in: shareCompanyTickers}, date: d })
    })
    .then(stocks => {
      if (!stocks) return next(resInternal('Failed to find stocks'))
      let finalSharesList = []
      for (let i in gShares) {
        let stock = stocks.find(s => s.company === gShares[i].company)
        if (stock) {
          const { id, amount, company, price, date, user } = gShares[i]
          let cp = stock.close
          let pp = cp - price
          let pa = pp * amount
          let volume = stock.volume
          
          finalSharesList.push({ volume: volume, id: id, company: company, amount: amount, price: price, date: date, user: user, cp: cp, pa: pa.toFixed(2) })
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

const createDate = () => {
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  let a = 1

   if (today.getDay() === 6) a = 1
   if (today.getDay() === 0) a = 2
   if (today.getDay() === 1) a = 3

  d = new Date(today.setDate(today.getDate() - a))
  d = d.setMinutes(d.getMinutes() - today.getTimezoneOffset())
}