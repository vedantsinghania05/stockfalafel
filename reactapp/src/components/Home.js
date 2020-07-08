import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Spinner, Alert } from 'reactstrap'
import Plot from 'react-plotly.js';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { connect } from 'react-redux';
import { updateUser, getStoredStockData, getUser, getUsersCompanies, getCompanyByTicker } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { result: '', userCompanyList: [], showGraph: false, selectedTicker: undefined, stockChartXValues: [], stockChartYValues: [], 
    companiesStr: '', loading: false, percentChange: [], numericChange: [], recentMovingAvgs: [], olderMovingAvgs: [], stockAvgXValues: [], 
    toggleGraph: false, showDataTable: false, comparisonCompany: '', comparisonXVals: [], comparisonYVals: [], comparisonLabel: '' }
  }

  componentDidMount = () => {

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

  back = () => this.setState({ showGraph: false, stockChartXValues: [], stockChartYValues: [], loading: false, showDataTable: false, toggleGraph: false })

  removeResult = () => this.setState({result: ''})

  fn = (stockData) => {
    let {stockChartXValues, stockChartYValues, numericChange, percentChange, stockAvgXValues } = this.state
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
        if (sortedStockData[i-50+i2] && sortedStockData[i-50+i2].open) {
          lastFiftyAdded = lastFiftyAdded + sortedStockData[i-50+i2].open
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
        if (sortedStockData[i-200+i2] && sortedStockData[i-200+i2].open) {
          last200Added = last200Added + sortedStockData[i-200+i2].open
          addedNoCount200++
        }
      }

      last200Avg = last200Added/addedNoCount200
      tempOlderMovingAvgs.push(last200Avg.toFixed(2))

      // Stock Data

      let b = +i+1
      
      stockAvgXValues.push(sortedStockData[i].date)
      stockChartXValues.push(stockData[i].date)
      stockChartYValues.push(stockData[i].open.toFixed(2))
      if (stockData[i].open > stockData[b].open)  {
        numericChange.push((stockData[i].open - stockData[b].open).toFixed(2))
        percentChange.push((((stockData[i].open - stockData[b].open)/stockData[i].open)*100).toFixed(3)+'%')
      }
      else {
        numericChange.push((stockData[i].open - stockData[b].open).toFixed(2))
        percentChange.push((((stockData[i].open - stockData[b].open)/stockData[i].open)*100).toFixed(3)+'%')
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
              this.state.comparisonYVals.push(response.data[i].open)
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


  render() {
    let { result, comparisonCompany, userCompanyList, showGraph, selectedTicker, stockChartXValues, stockChartYValues, recentMovingAvgs, olderMovingAvgs, 
    companiesStr, loading, percentChange, numericChange, stockAvgXValues, toggleGraph, showDataTable, comparisonXVals, comparisonYVals, comparisonLabel } = this.state
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
                <Input bsSize='sm' name='companiesStr' placeholder='Enter Companies Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
              </Form>

              <table>
                <tbody>
                  {userCompanyList && userCompanyList.map((company, i) => <tr key={i}>
                    <td>{company.ticker}</td>
                    <td><Button size='sm' color='primary' disabled={loading} onClick={() => this.sendtoGraph(company)}>{"->"}</Button></td>
                    <td><Button size='sm' color='primary' disabled={loading} onClick={() => this.deleteCompany(company)}>x</Button></td>
                  </tr>)}
                </tbody>
              </table>
            </div>}

            {showGraph && <div>
              <Button size='sm' color='primary' onClick={this.graphToggle}>{toggleGraph ? 'Show Data':'Compare Companies'}</Button>

              {!toggleGraph && <Plot
                data={[
                  { x: stockChartXValues, y: stockChartYValues, name: 'Price', type: 'scatter', marker: {color: 'red'}, mode: 'lines+markers' },
                  { x: stockChartXValues, y: percentChange, name: '% Change', type: 'scatter', marker: {color: 'blue'} },
                  { x: stockAvgXValues, y: recentMovingAvgs, name: '50 Day Moving Avg', type: 'scatter', marker: {color: 'orange'} },
                  { x: stockAvgXValues,y: olderMovingAvgs,name: '200 Day Moving Avg', type: 'scatter', marker: {color: 'green'} }
                ]}
                layout={{ title: selectedTicker, height: 400 }}
                useResizeHandler
                style={{ width: '90%' }}
                config={{ scrollZoom: true }}
              />}

              {toggleGraph && <div>
                <Form onSubmit={this.chooseComparison}>
                  <Input bsSize='sm' name='comparisonCompany' placeholder='Enter Company to Compare Here' value={comparisonCompany} onChange={this.onChangeComparison}/>
                </Form>

                <Plot 
                  data={[
                    { x: stockChartXValues, y: stockChartYValues, name: selectedTicker, type: 'scatter', marker: {color: 'red'}, mode: 'lines+markers' },
                    { x: comparisonXVals, y: comparisonYVals, name: comparisonLabel, type: 'scatter', marker: {color: 'blue'}, mode: 'lines+markers' }
                  ]}
                  layout={{ title: 'Company Comparison', height: 400 }}
                  useResizeHandler
                  style={{ width: '90%' }}
                  config={{ scrollZoom: true }}
                />
              </div>}

              {!toggleGraph && <Button size='sm' color='primary' onClick={this.tableToggle}>{showDataTable ? 'Hide Table':'Show Table'}</Button>}

              {showDataTable && <table>
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
                    <td>{stockChartYValues[i]}</td>
                  </tr>)}
                </tbody>
              </table>}
            </div>}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);