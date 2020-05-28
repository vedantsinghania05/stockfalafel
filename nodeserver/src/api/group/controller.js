import { resInternal, resCreated, resOk, resNoContent } from '../../services/response/'
import { Group } from '.'
import { User } from '../user'

export const create = ({ body }, res, next) => {
  let fields = { title: body.title, members: body.members, creator: body.creator };

  User.find({ email: { $in: fields.members }})
    .then(users => {
      if (!users) return next(resInternal('Failed to find users'));

      fields.members = users.map(u => u.id)

      return Group.create(fields)
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to create group'));

      return resCreated(res, group.view(true) )
    })
    .catch(next)
}

export const getGroupsForUser = ({ user }, res, next) => {
  Group.find({ members: user.id })
    .then(groups => {
      if (!groups) return next(resInternal('Failed to get groups for user'))

      return resOk(res, groups.map(g => g.view(true)))
    })
    .catch(next)
}

const ObjectId = require('mongodb').ObjectID

export const getGroupMembers = ({ params }, res, next) => {
  Group.findById(params.id)
    .then(group => {
      if (!group) return next(resInternal('Failed to find group'))

      let memberIds = group.members ? group.members.map(m => ObjectId(m)) : []
      return User.find({ _id: { $in: memberIds } })
    })
    .then(members => {
      if (!members) return next(resInternal('Failed to find members'))
      return resOk(res, members.map(m => m.view(true)))
    })
    .catch(next)
}

export const getGroupInfo = ({ params }, res, next) => {
  Group.findById(params.id)
    .then(group => {
      if (!group) return next(resInternal('Failed to find group'))
      return resOk(res, group.view(true))
    })
    .catch(next)
}

export const getFirstGroupInfo = ({ user }, res, next) => {
  Group.find({ members: user.id })
    .then(groups => {
      if (!groups || !groups[0]) return resOk(res, undefined)
      return resOk(res, groups[0].view(true));
    })
}

export const updateGroupTitle = ({ params, body }, res, next) => {
  Group.findById(params.id)
    .then(group => {
      if (!group) return next(resInternal('Failed to find group'))

      if (body.title) group.title = body.title
      return group.save()
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to update group'));
      return resOk(res, group.view(true));
    })
    .catch(next)
}

export const updateGroupMembers = ({ params, body }, res, next) => {
  let gGroup;

  Group.findById(params.id)
    .then(group => {
      if (!group) return next(resInternal('Failed to find group'))

      gGroup = group
      return User.findOne({ email: body.userEmail })

    })
    .then(user => {

      if (body.shouldAdd) {
        let groupMembers = gGroup.members ? gGroup.members.map(m => ObjectId(m)) : []
        groupMembers.push(user.id)
        gGroup.members = groupMembers

        return gGroup.save()
      } else {

        let i = 0
        for (let memberId of gGroup.members) {
          if (user._id.equals(memberId)) {
            gGroup.members.splice(i, 1)
          }
          i++
        }
        return gGroup.save()
      }
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to update group'))
      return resOk(res, group.view(true))
    })
    .catch(next)
}

export const destroy = ({ params }, res, next) => {
  Group.findById(params.id)
    .then(group => {
      if (!group) return next(resInternal('Failed to find group'));
      return group.remove();
    })
    .then(group => {
      if (!group) return next(resInternal('Failed to delete group'));
      return resNoContent(res, group.view(false))
    })
    .catch(next)
}

export const updateGroupCreator = ({params, body}, res, next) => {
  Group.findById(params.id)
  .then(group => {
    if (!group) return next(resInternal('Failed to find group'));
    if (body.creator) group.creator = body.creator
    return group.save()
  })
  .then(group => {
    if (!group) return next(resInternal('Failed to update group'));
    return resOk(res, group.view(true));
  })
}