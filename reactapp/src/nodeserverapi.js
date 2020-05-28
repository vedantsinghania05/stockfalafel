const axios = require('axios')
let axiosInstance = axios.create();

const masterKey = 'LwwGrzyouCKOo1tv2AGBJKBRwYy6qfjA';
const nodeserverUrl = 'http://localhost:9000';

/**
 * Auth
 */
export const signInUser = (username, password, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/auth',
    { access_token: masterKey },
    { auth: {
      username: username,
      password: password
    }}
  )
  .then(successCbk)
  .catch(errorCbk);
}


/**
 * User
 */
export const createUser = (username, password, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/users',
    {
      access_token: masterKey,
      email: username,
      password: password,
    },
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getAllUser = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/users/',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getMember = (token, groupId, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/' + groupId + '/members',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getUser = (id, token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/users/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const updateUser = (id, token, email, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/users/' + id,
    {
      email: email,
      access_token: token
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getValidUsers = (token, emailsList, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/users',
    {
      access_token: token,
      emails: emailsList
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const deleteUser  = (id, token, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/users/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}

/**
 * Group
 */
export const createGroup = (title, members, creator, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/groups',
    {
      access_token: masterKey,
      title: title,
      members: members,
      creator: creator
    },
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getGroupsForUser = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/user',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getGroupInfo = (token, groupId, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/' + groupId,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getFirstGroup = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/groups/first',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const updateTitleGroup = (token, groupId, title, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/groups/' + groupId + '/title',
    {
      access_token: token,
      title: title,
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const updateMembersGroup = (token, groupId, shouldAdd, userEmail, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/groups/' + groupId + '/addMembers',
    {
      access_token: token,
      shouldAdd: shouldAdd,
      userEmail: userEmail
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const deleteGroup = (token, groupId, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/groups/' + groupId,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const updateCreatorGroup = (token, groupId, creator, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/groups/' + groupId + '/changecreator',
    {
      access_token: token,
      creator: creator
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}
/**
 * Message
 */
export const createMessage = (poster, group, content, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/messages',
    {
      access_token: masterKey,
      poster: poster,
      group: group,
      content: content
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getMessages = (token, group, skipCount, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/messages?group=' + group + '&skipCount=' + skipCount,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const deleteGroupsMessage = (token, groupId, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/messages/' + groupId,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const countGroupsMessage = (token, groupId, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/messages/' + groupId + '/count',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
   }