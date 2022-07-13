import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, index, getUsersCompanies, destroy } from './controller'
import { schema } from './model'
export Company, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/',
  token({ required: true }),
  index)

router.get('/user',
  token({ required: true }),
  getUsersCompanies)

router.delete('/:ticker',
  token({ required: true }),
  destroy)

export default router
