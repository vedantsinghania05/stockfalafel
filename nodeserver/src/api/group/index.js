import { Router } from 'express'
import { master, token } from '../../services/passport'
import { create, getGroupsForUser, getGroupInfo, getGroupMembers, getFirstGroupInfo, updateGroupTitle, updateGroupMembers, destroy, updateGroupCreator } from './controller'
import { schema } from './model'
export Group, { schema } from './model'

const router = new Router()

router.post('/',
  master(),
  create)

router.get('/user',
  token({ required: true }),
  getGroupsForUser)

router.get('/first',
  token({ required: true }),
  getFirstGroupInfo)
  
router.get('/:id',
  token({ required: true }),
  getGroupInfo)

router.get('/:id/members',
  token({ required: true }),
  getGroupMembers)

router.put('/:id/title',
  token({ required: true }),
  updateGroupTitle)

router.put('/:id/addMembers',
  token({ required: true }),
  updateGroupMembers)

router.delete('/:id',
  token({ required: true }),
  destroy)

router.put('/:id/changecreator',
  token({ required: true }),
  updateGroupCreator)

export default router