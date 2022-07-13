import { sign } from '../../services/jwt'
import { resError, resNotFound, resCreated } from '../../services/response/'

export const login = ({ user }, res, next) => {
  if (!user) return resError(res, resNotFound('Failed to find user'));

  return sign(user.id)
    .then(token => {
      return resCreated(res, { token, user: user.view(true) });
    })
    .catch(next)
}