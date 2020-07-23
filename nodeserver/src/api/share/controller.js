import { resInternal, resNoContent, resCreated, resOk } from '../../services/response/'
import { Share } from '.'
import { Company } from '../company'
import { Stock } from '../stock'
import mongoose from 'mongoose'

export const create = ({ body }, res, next) => {
  let fields = {ticker: body.ticker, amount: body.amount, user: body.user, price: '', date: ''}

  Company.findOne({ ticker: body.ticker })
  .then(company => {
    if (!company) return next(resInternal('Failed to find company'))
    return Stock.find({company: company.id})
  })
  .then(stocks => {
    if (!stocks) return next(resInternal('Failed to find stock'))
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
      let gShares = shares
      let shareTickers = []
      for (let share of shares) shareTickers.push(share.ticker)
      console.log('>>>>>>> sharetickers', shareTickers)
      return Company.find({ ticker: {$in: shareTickers} })
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