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

export const updateUser = (id, token, email, companies, adding, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/users/' + id,
    {
      email: email,
      companies: companies,
      access_token: token,
      adding: adding
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
export const getStock = (token, company, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/stocks',
    {
      access_token: token,
      company: company
    }
  )
  .then(successCbk)
  .catch(errorCbk);
}

export const getUnusualVolStocks = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/volume',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getTopGainingStocks = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/gainers',
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getStoredStockData = (token, ticker, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/info/' + ticker,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getPercentageIncreases = (token, tickers, rangeList, successCbk, errorCbk) => {
  axiosInstance.put(nodeserverUrl + '/stocks/percentages',
    {
      access_token: token,
      tickers: tickers,
      rangeList: rangeList
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getHighLow = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/stocks/',
    { headers: {Authorization: 'Bearer ' + token } }  
  )
  .then(successCbk)
  .catch(errorCbk)
}

/**
 * Company
 */
export const createCompany = (ticker, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/companies',
    {
      access_token: masterKey,
      ticker: ticker    
    },
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

export const deleteCompany = (token, ticker, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/companies/' + ticker,
    { headers: { Authorization: 'Bearer ' + token } },
  )
  .then(successCbk)
  .catch(errorCbk)
}

/**
 * Share
 */

export const createShare = (ticker, amount, date, cost, user, successCbk, errorCbk) => {
  axiosInstance.post(nodeserverUrl + '/shares/',
    {
      access_token: masterKey,
      ticker: ticker,
      amount: amount,
      date: date,
      cost: cost,
      user: user
    }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const getShares = (token, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/shares',
    { headers: { Authorization: 'Bearer ' + token } }
  ) 
  .then(successCbk)
  .catch(errorCbk)
}

export const removeShares = (id, token, successCbk, errorCbk) => {
  axiosInstance.delete(nodeserverUrl + '/shares/' + id,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}

export const findCurrentPrice = (token, ticker, successCbk, errorCbk) => {
  axiosInstance.get(nodeserverUrl + '/shares/' + ticker,
    { headers: { Authorization: 'Bearer ' + token } }
  )
  .then(successCbk)
  .catch(errorCbk)
}
