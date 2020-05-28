import { Router } from 'express'
import { master, token } from '../../services/passport'
import { getMessages, create, deleteGroupsMessages, countGroupsMessages } from './controller'
import { schema } from './model'
export Message, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/',
  token({ required: true }),
  getMessages)

router.delete('/:id',
  token({ required: true }),
  deleteGroupsMessages)

router.get('/:id/count',
  token ({ required: true }),
  countGroupsMessages)

export default router