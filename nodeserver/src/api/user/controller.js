import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { User } from '.'
import { Group } from '../group'
import { sign } from '../../services/jwt'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.find(query, select, cursor)
    .then(users => {
      if (!users) return next(resInternal('Failed to find users'));
      return resOk(res, users.map(user => user.view()));
    })
    .catch(next)

const ObjectId = require('mongodb').ObjectID

export const show = ({ params, user }, res, next) => {
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(user => {
      if (!user) return next(resNotFound('Failed to find user'));

      return Group.find({ members: user._id })
    })
    .then(groups => {
      let response = user.view(true)
      response.groups = groups

      return resOk(res, response);
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

export const update = ({ params, body, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(user => {
      if (!user) return next(resNotFound('Failed to find user'));

      if (body.email) user.email = body.email;
      return user.save();
    })
    .then(user => {
      if (!user) return next(resInternal('Failed to update user'));
      return resOk(res, user.view(true));
    })
    .catch(next)

export const getValidUsers = ({ body }, res, next) => {
  User.find({ email: { $in: body.emails } })
    .then(users => {
      return resOk(res, users.map(u => u.view(true)))
    })
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