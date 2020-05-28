import { Router } from 'express'
import { login } from './controller'
import { password, master } from '../../services/passport'

const router = new Router()

router.post('/',
  master(),
  password(),
  login)

export default router
