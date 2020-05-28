import { Router } from 'express'
import { middleware as query } from 'querymen'
import { password as passwordAuth, master, token } from '../../services/passport'
import { show, create, update, updatePassword, destroy, getValidUsers } from './controller'
import { schema } from './model'
export User, { schema } from './model'

const router = new Router()

/*router.get('/',
  token({ required: true }),
  query(),
  getGroupsUser)*/

router.get('/:id',
  token({ required: true }),
  show)

router.post('/',
  master(),
  create)

router.put('/:id',
  token({ required: true }),
  update)

router.put('/',
  token({ required: true }),
  getValidUsers)

router.put('/:id/password',
  passwordAuth(),
  updatePassword)

router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
