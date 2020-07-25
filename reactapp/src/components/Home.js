import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Spinner, Alert, Row, Col, Table } from 'reactstrap'
import Plot from 'react-plotly.js';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { connect } from 'react-redux';
import { updateUser, getStoredStockData, getUser, getUsersCompanies, getCompanyByTicker, createShare, getShares, removeShares } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { result: '', userCompanyList: [], showGraph: false, selectedTicker: undefined, stockChartXValues: [], stockChartYClose: [], stockChartYOpen: [], stockChartYHigh: [], stockChartYLow: [], 
    companiesStr: '', loading: false, percentChange: [], numericChange: [], recentMovingAvgs: [], olderMovingAvgs: [], stockAvgXValues: [], 
    toggleGraph: false, showDataTable: false, comparisonCompany: '', comparisonXVals: [], comparisonYVals: [], comparisonLabel: '', volume: [], ticker: '', amount: '', purchasedStocks: [] }
  }

  componentDidMount = () => {
    this.getShare()
    getUser('me', getUserToken(),
      response => {
        let companyIds = []
        for (let company of response.data.companies) companyIds.push(company)

        getUsersCompanies(getUserToken(),
          response => {
            this.setState({ userCompanyList: response.data })
          },
          error => {
            this.setState({result: error.message})
          }
        )

      },
      error => {
        this.setState({result: error.message})
      }
    )

  }

  onChangeCompaniesStr = (e) => this.setState({ companiesStr: e.target.value.toUpperCase() })

  onChangeComparison = (e) => this.setState({ comparisonCompany: e.target.value.toUpperCase() })

  onChangeTicker = (e) => this.setState({ticker: e.target.value.toUpperCase()})

  onChangeAmount = (e) => this.setState({amount: e.target.value})


  chooseCompanies = (e) => {
    let { companiesStr } = this.state
    let { userInfo } = this.props;
    e.preventDefault()

    updateUser(userInfo.id, getUserToken(), userInfo.email, companiesStr, true,
      response => {
        if (response.data === 'no data for company') this.setState({ result: "No Data For Company", companiesStr: '' })
        else {
          this.setState({ result: '' })
          getUser('me', getUserToken(),
            response => {
              this.props.setUserInfo(response.data)
              let companyIds = []
              for (let company of response.data.companies) {
                companyIds.push(company)
              }
      
              getUsersCompanies(getUserToken(),
                response => {
                  this.setState({ userCompanyList: response.data, companiesStr: '' })
                },
                error => {
                  this.setState({result: error.message})
                }
              )
      
            },
            error => {
              this.setState({result: error.message})
            }
          )
        }
      },
      error => {
        this.setState({result: error.message})
      }
    )

  }

  sendtoGraph = (company) => {
    let companyId = undefined

    if (company.id) companyId = company.id
    if (company._id) companyId = company._id

    this.setState({loading: true})

    getStoredStockData(companyId, getUserToken(),
      response => {
        this.setState({ showGraph: true, selectedTicker: company.ticker }) 
        this.fn(response.data)
        this.setState({loading: false})
      },
      error => {
        this.setState({result: error.message, loading: false})
      }
    )
  }

  deleteCompany = (company) => {
    
    let usersCompanies = [...this.props.userInfo.companies]

    for (let i in usersCompanies) {
      if (String(usersCompanies[i]) === String(company.id)) {
        usersCompanies.splice(i, 1)
      }
    }

    updateUser(this.props.userInfo.id, getUserToken(), this.props.userInfo.email, usersCompanies, false,
    response => {
      getUser('me', getUserToken(),
        response => {
          this.props.setUserInfo(response.data)
          let companyIds = []
          for (let company of response.data.companies) {
            companyIds.push(company)
          }

          getUsersCompanies(getUserToken(),
            response => {
              this.setState({ userCompanyList: response.data , companiesStr: '' })
            },
            error => {
              this.setState({result: error.message})
            }
          )
        },
        error => {
          this.setState({result: error.message})
        }
      )
    },
    error => {
      this.setState({result: error.message})
    }
  )

  }

  back = () => { 
    this.setState({ showGraph: false, stockChartXValues: [], stockChartYValues: [], loading: false, showDataTable: false, toggleGraph: false, 
    stockAvgXValues: [], volume: [], percentChange: [], numericChange: [], stockChartYClose: [], stockChartYOpen: [], stockChartYHigh: [], stockChartYLow: []}) 
  }

  removeResult = () => this.setState({result: ''})

  fn = (stockData) => {
    let { stockAvgXValues, stockChartXValues, stockChartYClose, stockChartYHigh, stockChartYOpen, stockChartYLow, volume, numericChange, percentChange } = this.state
    let tempRecentMovingAvgs = []
    let tempOlderMovingAvgs = []
    let sortedStockData = [...stockData]    
    sortedStockData.sort((b,a) => new Date(b.date) - new Date(a.date))

    for (let i = 0; i < sortedStockData.length-1; i++) {
      // Calculate 50 day moving average

      let lastFiftyAdded = 0
      let lastFiftyAvg = -1
      let addedNoCount50 = 0

      for (let i2 = 0; i2 <= 50; i2++) { 
        if (sortedStockData[i-50+i2] && sortedStockData[i-50+i2].close) {
          lastFiftyAdded = lastFiftyAdded + sortedStockData[i-50+i2].close
          addedNoCount50++
        }
      }

      lastFiftyAvg = lastFiftyAdded/addedNoCount50
      tempRecentMovingAvgs.push(lastFiftyAvg.toFixed(2))

      // Calculate 200 day moving average

      let last200Added = 0
      let last200Avg = -1
      let addedNoCount200 = 0

      for (let i2 = 0; i2 <= 200; i2++) { 
        if (sortedStockData[i-200+i2] && sortedStockData[i-200+i2].close) {
          last200Added = last200Added + sortedStockData[i-200+i2].close
          addedNoCount200++
        }
      }

      last200Avg = last200Added/addedNoCount200
      tempOlderMovingAvgs.push(last200Avg.toFixed(2))

      // Stock Data

      let b = +i+1
      stockAvgXValues.push(sortedStockData[i].date)
      stockChartXValues.push(stockData[i].date)
      stockChartYClose.push(stockData[i].close.toFixed(2))
      stockChartYOpen.push(stockData[i].open.toFixed(2))
      stockChartYHigh.push(stockData[i].high.toFixed(2))
      stockChartYLow.push(stockData[i].low.toFixed(2))
      volume.push(stockData[i].volume)
      if (stockData[i].close > stockData[b].close)  {
        numericChange.push((stockData[i].close - stockData[b].close).toFixed(2))
        percentChange.push((((stockData[i].close - stockData[b].close)/stockData[i].close)*100).toFixed(3)+'%')
      }
      else {
        numericChange.push((stockData[i].close - stockData[b].close).toFixed(2))
        percentChange.push((((stockData[i].close - stockData[b].close)/stockData[i].close)*100).toFixed(3)+'%')
      }
    
    }
    this.setState({ recentMovingAvgs: tempRecentMovingAvgs, olderMovingAvgs: tempOlderMovingAvgs })
  }

  graphToggle = () => this.setState({ toggleGraph: !this.state.toggleGraph })

  tableToggle = () => this.setState({ showDataTable: !this.state.showDataTable })

  chooseComparison = (e) => {
    e.preventDefault()
    this.setState({loading: true})
    let { comparisonCompany } = this.state;
    let companyId = undefined

    getCompanyByTicker(getUserToken(), comparisonCompany,
      response => {
        if (response.data.id) companyId = response.data.id
        if (response.data._id) companyId = response.data._id

        getStoredStockData(companyId, getUserToken(),
          response => {
            console.log('comparison company stock data: ', response.data)
            this.setState({comparisonXVals: [], comparisonYVals: [] })
            for (let i in response.data) {
              this.state.comparisonXVals.push(response.data[i].date)
              this.state.comparisonYVals.push(response.data[i].close)
            }
            this.setState({comparisonLabel: comparisonCompany, comparisonCompany: '', loading: false})
          },
          error => {
            this.setState({result: error.message})
          }
        )
      },
      error => {
        this.setState({result: error.message, loading: false})
      }
    )
  }

  submitPurchasedStocks = () => {
    let { ticker, amount, purchasedStocks } = this.state
    createShare(ticker, amount, this.props.userInfo.id,
      response => {
        purchasedStocks.push(response.data)
        this.setState({purchasedStocks: purchasedStocks, ticker: '', amount: ''})
        
      },
      error => {
        this.setState({result: error.message})
      }
    )
  }

  getShare = () => {
    let { purchasedStocks } = this.state
    getShares(getUserToken(), 
      response => {
        console.log(response.data)
        for (let i of response.data) purchasedStocks.push(i)
        this.setState({purchasedStocks: purchasedStocks})
      },
      error => {
        this.setState({result: error.message})
      }
    )
  }

  soldStock = (u,i) => {
    let {purchasedStocks} = this.state
    console.log('stock to be deleted', u)
    removeShares(u.id, getUserToken(),
      response => {
        purchasedStocks.splice(i, 1)
        this.setState({purchasedStocks: purchasedStocks})

      },
      error => {
        this.setState({result: error.message})
      }
    )
  }


  render() {
    let { result, comparisonCompany, userCompanyList, showGraph, selectedTicker, stockChartXValues, stockChartYClose, stockChartYOpen, stockChartYLow, stockChartYHigh, recentMovingAvgs, olderMovingAvgs, 
    companiesStr, loading, percentChange, numericChange, stockAvgXValues, toggleGraph, showDataTable, comparisonXVals, comparisonYVals, comparisonLabel, 
    volume, ticker, amount, purchasedStocks } = this.state

    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>
    
            <div className="card__title">
              <h5 className="bold-text">{showGraph ? <Button size='sm' color='primary' onClick={this.back}>{"<-"}</Button> : "Home"}</h5>
            </div>

            {result && <Alert toggle={this.removeResult} color='danger' size='sm' >{result}</Alert>}
            {loading && <Spinner size='sm' color='primary'></Spinner>}

            {!showGraph && <div>
              <Form onSubmit={this.chooseCompanies}>
                <Input bsSize='sm' name='companiesStr' placeholder='Enter Company Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
              </Form>

              {userCompanyList && <Table borderless size='sm'>
                <tbody>
                  {userCompanyList.map((company, i) => <tr key={i}>
                    <td>{company.ticker}</td>
                    <td><Button size='sm' color='primary' disabled={loading} onClick={() => this.sendtoGraph(company)}>{"->"}</Button><Button size='sm' color='primary' disabled={loading} onClick={() => this.deleteCompany(company)}>x</Button></td>
                    <td></td>
                  </tr>)}
                </tbody>
              </Table>}

              <br/>

              <Row md='auto'>
                <Col><Input type='string' placeholder='Ticker' bsSize='sm' value={ticker} onChange={this.onChangeTicker}/></Col>
                <Col><Input type='number' placeholder='Amount' bsSize='sm' value={amount} onChange={this.onChangeAmount}/></Col>
              </Row>
              <Button size='sm' color='primary' onClick={this.submitPurchasedStocks}>Submit</Button>
              
              {purchasedStocks.length >= 1 && <Table borderless size='sm'>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Amount</th>
                    <th>Date of Buy</th>
                    <th>Price @ Buy</th>
                    <th>Current Price</th>
                    <th>Profit Per</th>
                    <th>Profit For All</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasedStocks.map((u, i) => <tr key={i}>
                    <td>{u.company}</td>
                    <td>{u.amount}</td>
                    <td>{u.date.split('T')[0]}</td>
                    <td>{'$' + u.price}</td>
                    <td>{u.cp}</td>
                    <td>{u.pp}</td>
                    <td>{u.pa}</td>
                    <th><Button size='sm' color='primary' onClick={() => this.soldStock(u,i)}>x</Button></th>
                  </tr>)}
                </tbody>
              </Table>}
            </div>}

            {showGraph && <div>
              <Button size='sm' color='primary' onClick={this.graphToggle}>{toggleGraph ? 'Show Data':'Compare Companies'}</Button>

              {!toggleGraph && <Plot
                data={[

                  { name: 'OHLC', x: stockChartXValues, type: 'ohlc', close: stockChartYClose, open: stockChartYOpen, high: stockChartYHigh, low: stockChartYLow, marker: {size: 4}, mode: 'lines+markers', yaxis: 'y2' },
                  { x: stockAvgXValues, y: recentMovingAvgs, name: '50 Day MA', type: 'scatter', yaxis: 'y2', marker: {color: 'orange'} },
                  { x: stockAvgXValues, y: olderMovingAvgs, name: '200 Day MA', type: 'scatter', yaxis: 'y2', marker: {color: 'blue'} },           
                  { x: stockChartXValues, y: volume, name: 'Volume', type: 'bar', marker: {color: 'purple'}, yaxis: 'y1' }

                ]}
                layout={{ 
                  yaxis: {domain: [0, 0.3]},
                  yaxis2: {domain: [0.25, 1]},

                  title: selectedTicker, 
                  height: 650, 
                  xaxis: { 
                    rangeselector: {buttons: [{count: 1, label: '1d', step: 'day'}, {count: 7, label: '1w', step: 'day'}, {count: 1, label: '1m', step: 'month'}, {count: 6, label: '6m', step: 'month'}, {count: 1, label: '1y', step: 'year'}, {count: 5, label: '5y', step: 'year'}, {step: 'all'}]},
                    range: [stockChartXValues[99], stockChartXValues[0]],
                    rangeslider: true
                  }
                  }}
                useResizeHandler
                style={{ width: '90%' }}
              />}

              {toggleGraph && <div>
                <Form onSubmit={this.chooseComparison}>
                  <Input bsSize='sm' name='comparisonCompany' placeholder='Enter Company to Compare Here' value={comparisonCompany} onChange={this.onChangeComparison}/>
                </Form>

                <Plot 
                  data={[
                    { x: stockChartXValues, y: stockChartYClose, name: selectedTicker, type: 'scatter', marker: {color: 'red'}, mode: 'lines+markers' },
                    { x: comparisonXVals, y: comparisonYVals, name: comparisonLabel, type: 'scatter', marker: {color: 'blue'}, mode: 'lines+markers' }
                  ]}
                  layout={{ title: 'Company Comparison', height: 500 }}
                  useResizeHandler
                  style={{ width: '90%' }}
                  config={{ scrollZoom: true }}
                />
              </div>}

              {!toggleGraph && <Button size='sm' color='primary' onClick={this.tableToggle}>{showDataTable ? 'Hide Table':'Show Table'}</Button>}

              {showDataTable && <Table borderless size='sm'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Change(%)</th>
                    <th>Change($)</th>
                    <th>Price($)</th>
                  </tr>
                </thead>
                <tbody>
                  {stockChartXValues.map((u, i) => <tr key={i}>
                    <td>{u.split('T')[0]}</td>
                    <td>{percentChange[i]}</td>
                    <td>{numericChange[i]}</td>
                    <td>{stockChartYClose[i]}</td>
                  </tr>)}
                </tbody>
              </Table>} 
              </div>}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);
