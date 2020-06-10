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
 * Stock
 */

export const saveStock = (symbol, date, openVal, highVal, lowVal, closeVal, volumeVal, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/stocks',
    {
      access_token: masterKey,
      symbol: symbol,
      date: date,
      open: openVal,
      high: highVal,
      low: lowVal,
      close: closeVal,
      volume: volumeVal
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getStock = (token, company, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/?company=' + company,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const saveManyStocks = (stockData, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/stocks/bulk',
    {
      access_token: masterKey,
      stockData: stockData
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}
