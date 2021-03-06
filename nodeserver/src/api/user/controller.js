import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { User } from '.'
import { Stock } from '../stock/index'
import { Company } from '../company'
import { sign } from '../../services/jwt'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.find(query, select, cursor)
    .then(users => {
      if (!users) return next(resInternal('Failed to find users'));
      return resOk(res, users.map(user => user.view()));
    })
    .catch(next)

export const show = ({ params, user }, res, next) => {
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(user => {
      if (!user) return next(resNotFound('Failed to find user'));
      return resOk(res, user.view(true));
    })
    .catch(next)
}

export const create = ({ body }, res, next) => {
  let fields = { email: body.email, password: body.password, creator: body.creator };

  let gUser = undefined;
  return User.create(fields)
    .then(user => {
      if (!user) return next(resInternal('Failed to create user'));
      gUser = user;
      return sign(user.id);
    })
    .then(token => {
      return resCreated(res, { token, user: gUser.view(true) })
    })
    .catch(next)
}

import mongoose from 'mongoose'

export const update = ({ params, body, user }, res, next) => {
  console.log('>>>>>>>>>>>>>>> *** ', body.companies)

  if (body.adding) {
    let initCompany = undefined
    let gCompanies = undefined
    Company.findOne({ ticker: body.companies })
      .then(company => {
        if (!company) return next(resInternal('Failed to find companies'))
        initCompany = company
        return Stock.find({ company: company.ticker })
      })
      .then(stocks => {
        if (stocks.length === 0 || !stocks) return resOk(res, 'no data for company')
        gCompanies = initCompany
        return User.findById(user.id)
      })
      .then(user => {
        if (!user) return next(resNotFound('Failed to find user'));

        let usersCompanies = [...user.companies]
        usersCompanies.push(gCompanies.ticker)

        if (body.email) user.email = body.email;
        if (gCompanies) user.companies = usersCompanies
        return user.save();
      })
      .then(user => {
        if (!user) return next(resInternal('Failed to update user'));
        return resOk(res, user.view(true));
      })
      .catch(next)
  } else {
    User.findById(params.id === 'me' ? user.id : params.id)
      .then(user => {
        user.email = body.email
        user.companies = body.companies
        console.log(user.companies)

        return user.save()
      })
      .then(user => {
        if (!user) return next(resInternal('Failed to update user'));
        return resOk(res, user.view(true));
      })
      .catch(next)
  }
}

export const updatePassword = ({ params, body, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(user => {
      if (!user) return next(resNotFound('Failed to find user'));

      if (body.email) user.password = body.password;
      return user.save();
    })
    .then(user => {
      if (!user) return next(resInternal('Failed to update user password'));
      return resOk(res, user.view(true));
    })
    .catch(next)

export const destroy = ({ params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(user => {
      if (!user) return next(resInternal('Failed to find user'));
      return user.remove();
    })
    .then(user => {
      if (!user) return next(resInternal('Failed to delete user'));
      return resNoContent(res, user.view(false));
    })
    .catch(next)