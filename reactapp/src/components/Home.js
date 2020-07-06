import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Spinner, Alert } from 'reactstrap'
import Plot from 'react-plotly.js';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { connect } from 'react-redux';
import { updateUser, getStoredStockData, getUser, getUsersCompanies } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { result: '', userCompanyList: [], showGraph: false, selectedTicker: undefined, stockChartXValues: [], stockChartYValues: [], 
    companiesStr: '', loading: false, percentChange: [], numericChange: [] }
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

  onChangeCompaniesStr = (e) => this.setState({ companiesStr: e.target.value.toUpperCase()})

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
    setTimeout(() => { this.setState({ loading: false }) }, 5000)

    getStoredStockData(companyId, getUserToken(),
      response => {
        this.setState({ showGraph: true, selectedTicker: company.ticker }) 
        this.fn(response.data)
      },
      error => {
        this.setState({result: error.message})
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

  back = () => this.setState({ showGraph: false, stockChartXValues: [], stockChartYValues: [], loading: false })

  removeResult =() => this.setState({result: ''})

  fn = (stockData) => {
    let { stockChartXValues, stockChartYValues, percentChange, numericChange } = this.state
    for (let i = 0; i < stockData.length-1; i++) {
      let b = +i+1
      stockChartXValues.push(stockData[i].date)
      stockChartYValues.push(stockData[i].open)
      if (stockData[i].open > stockData[b].open)  {
        numericChange.push((stockData[i].open - stockData[b].open).toFixed(2))
        percentChange.push('+' + (((stockData[i].open - stockData[b].open)/stockData[i].open)*100).toFixed(3)+'%')
      }
      else {
        numericChange.push((stockData[i].open - stockData[b].open).toFixed(2))
        percentChange.push((((stockData[i].open - stockData[b].open)/stockData[i].open)*100).toFixed(3)+'%')
      }
    }
  }


  render() {
    let { result, userCompanyList, showGraph, selectedTicker, stockChartXValues, stockChartYValues, companiesStr, loading, percentChange, numericChange } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

              <div className="card__title">
                <h5 className="bold-text">{showGraph ? <Button size='sm' color='primary' onClick={this.back}>{"<-"}</Button> : "Home"}</h5>
              </div>

              {result && <Alert toggle={this.removeResult} color='danger' size='sm' >{result}</Alert>}

              {!showGraph && <div>
                {loading && <Spinner size='sm' color='primary'></Spinner>}

                <Form onSubmit={this.chooseCompanies}>
                  <Input bsSize='sm' name='companiesStr' placeholder='Enter Companies Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
                </Form>

                <table size='sm'>
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
              <Plot
                data={[
                  { name: 'Price', x: stockChartXValues, y: stockChartYValues, marker: {color: 'red'}, type: 'scatter', mode: 'lines+markers' },
                  { name: '% Change', x: stockChartXValues, y: percentChange, marker: {name:'bob', color: 'blue'}, type: 'scatter', mode: 'lines+markers' }
                ]}
                layout={{ scrollZoom: true, width: 720, height: 440, title: selectedTicker }}
              />

              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Change(%)</th>
                    <th>Change($)</th>
                  </tr>
                </thead>
                <tbody>
                  {stockChartXValues.map((u, i) => <tr key={i}>
                    <td>{u.split('T')[0]}</td>
                    <td>{percentChange[i]}</td>
                    <td>{numericChange[i]}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);