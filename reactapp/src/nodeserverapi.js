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

export const updateUser = (id, token, email, companies, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/users/' + id,
    {
      email: email,
      companies: companies,
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
  .catch(errorCbk);
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
export const getStock = (token, tickers, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/stocks',
    {
      access_token: token,
      companies: tickers
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getStoredStockData = (id, token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

/**
 * Company
 */
export const createCompany = (tickers, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/companies',
    {
      access_token: masterKey,
      ticker: tickers    },
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getAllCompany = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/companies',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getUsersCompanies = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/companies/user',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}
