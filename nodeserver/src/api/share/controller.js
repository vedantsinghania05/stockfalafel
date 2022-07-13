import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'

export const create = ({ body }, res, next) => {
  let fields = { amount: body.amount, user: body.user, cost: body.cost, date: body.date, company: body.ticker }
  let gStock = undefined
  Company.findOne({ ticker: body.ticker })
    .then(company => {
      if (!company) return next(resInternal('Failed to find company'))
      return Stock.findOne({ company: company.ticker, date: body.date })
    })
    .then(stock => {
      if (!stock) return next(resInternal('Failed to find stock'))
      gStock = stock
      return Share.create(fields)
    })
    .then(share => {
      if (!share) return next(resInternal('Failed to create share'))
      return resCreated(res, share)
    })
    .catch(next)
}

export const getShareByUserId = ({ user }, res, next) => {
  let gShares = undefined
  let shareCompanyTickers = []
  let finalSharesList = []
  Share.find({ user: user.id })
    .then(shares => {
      if (!shares) return next(resInternal('Failed to find shares'))
      gShares = shares
      for (let share of shares) shareCompanyTickers.push(share.company)
      return Stock.find({ company: { $in: shareCompanyTickers } })
    })
    .then(stocks => {
      if (!stocks) return next(resInternal('Failed to find stocks'))
      for (let i in gShares) {
        let stock = stocks.filter(s => s.company === gShares[i].company)
        if (stock) {
          const { id, amount, company, cost, date, user } = gShares[i]
          let cp = stock[0].close
          let pp = cp - cost
          let gd = pp * amount
          finalSharesList.push({
            user: user, id: id, company: company, date: date, cp: cp.toFixed(2), amount: amount, cost: Number(cost).toFixed(2), mv: (amount * cp).toFixed(2), gd: gd.toFixed(2),
            gp: Number(((cp - cost) / cost) * 100).toFixed(2), changeD: (((cp - stock[1].close) / stock[1].close) * 100).toFixed(2), changeW: (((cp - stock[5].close) / stock[5].close) * 100).toFixed(2),
            changeM: (((cp - stock[25].close) / stock[25].close) * 100).toFixed(2), changeY: (((cp - stock[259].close) / stock[259].close) * 100).toFixed(2)
          })
        }
      }
      return resOk(res, finalSharesList)
    })
    .catch(next)
}

export const destroy = ({ params }, res, next) => {
  Share.deleteOne({ _id: params.id })
    .then(share => {
      if (!share) return next(resInternal('Failed to delete share'))
      return resNoContent(res, 'No Content')
    })
}

export const findRecentPrice = ({ params }, res, next) => {
  Stock.find({ company: params.ticker })
    .then(stocks => {
      if (!stocks) return next(resInternal('Failed to find stocks'))
      return resOk(res, stocks[0])
    })
}