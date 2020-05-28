import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Message } from '.'
import { populateManyPosters, populateMessagePoster } from './model';

export const create = ({ body }, res, next) => {
  let fields = { poster: body.poster, group: body.group, content: body.content };

  return Message.create(fields)
    .then(message => {
      if (!message) return next(resInternal('Failed to create message'));
      return populateMessagePoster(message)})
    .then(message => {
      if (!message) return next(resInternal('Failed to populate message'))
      return resCreated(res, message.view(true))
    })
    .catch(next)
}

export const getMessages = ({ query }, res, next) => {
  let { group, skipCount } = query
  skipCount = Number(skipCount)

  return Message.find({ group: group })
    .sort('-createdAt')
    .limit(50)
    .skip(skipCount)

    .then(messages => {
      return populateManyPosters(messages);
    })
    .then(messages => {
      if (!messages) return next(resInternal('Failed to populate messages'));
      return resOk(res, messages.map(m => m.view()));
    })
    .catch(next)
}

export const deleteGroupsMessages = ({ params }, res, next) => {
  Message.deleteMany({ group: params.id })
    .then(messages => {
      if (!messages) return next(resInternal('Failed to delete messages'))
      return resNoContent(res)
    })
    .catch(next)
}

export const countGroupsMessages =({ params }, res, next) => {
  Message.countDocuments({ group: params.id })
    .then(messages => {
      if (!messages && messages != 0) return next(resInternal('Failed to count messages'))
      // return console.log(">>>>>>>", messages)
      return resOk(res, messages)
    })
  .catch(next)
}

