import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'
import mongoose from 'mongoose'

export const create = ({ body }, res, next) => {
  let fields = {amount: body.amount, user: body.user, price: '', date: ''}

  console.log('ticker', body.ticker)

  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    fields.company = company.id
    console.log('>>>>>> fields.company', fields.company)
    return Stock.find({company: company.id})
  })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to find stock'))
    console.log('>>>>>>>>', stocks[0].date, stocks[0].open)
    fields.date = stocks[0].date
    fields.price = stocks[0].open
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
      console.log('>>>>> shares', shares)
      gShares = shares
      let shareCompanyIds = []
      for (let share of shares) shareCompanyIds.push(share.company)
      console.log('>>>>>>> sharetickers', shareCompanyIds)
      return Company.find({ _id: {$in: shareCompanyIds} })
    })
    .then(companies => {
      console.log('>>>>>> companies: ', companies)
      if (!companies) return next(resInternal('Failed to find companies'))
      let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
      let offset = today.getTimezoneOffset()
      console.log("<><><>iffset", offset)
      let d = new Date(today.setDate(today.getDate() - 1))
      d = d.setMinutes(d.getMinutes() - offset)
      let companyIds = []
      for (let company of companies) console.log('>>>>> type: ', typeof company._id)
      for (let company of companies) companyIds.push(company._id)
      console.log('>>>>>>> companyids', companyIds)
      console.log('>>>>>>> date/d: ', d, typeof d)
      return Stock.find({ company: {$in: companyIds}, date: d })
    })
    .then(stocks => {
      console.log('>>>>>>>>>> stocks ', stocks)
      console.log('>>>>>>>>>> gShares: ', gShares)

      let finalSharesList = []
      for (let i in gShares) {
        console.log('***', i, gShares[i])
        let stock = stocks.find(s => s.company.equals(gShares[i].company))
        if (stock) {
          const { id, company, amount, price, date, user } = gShares[i]

          console.log('>>>>>>', stock.close, price, amount, date, stock.date)

          let cp = stock.close
          let pp = cp - price
          let pa = pp * amount

          finalSharesList.push({ id: id, company: company, amount: amount, price: price, date: date, user, user, cp: cp, pp: pp, pa, pa })
        } 
      }
      console.log('>>>>>>> FINAL: ', finalSharesList)
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