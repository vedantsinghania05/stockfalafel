import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, getShareByUserId, destroy, findRecentPrice } from './controller'
import { schema } from './model'
export Share, { schema } from './model'

const router = new Router()

router.post('/',
master(),
create)

router.get('/',
token({required: true}),
getShareByUserId)

router.delete('/:id',
token({required: true}),
destroy)

router.get('/:ticker',
token({required: true}),
findRecentPrice)

export default router