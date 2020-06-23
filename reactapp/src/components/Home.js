import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Table, Spinner } from 'reactstrap'
import Plot from 'react-plotly.js';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { connect } from 'react-redux';
import { updateUser, getStoredStockData, getUser, getUsersCompanies } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { userCompanyList: [], showGraph: false, selectedTicker: undefined, stockChartXValues: [], stockChartYValues: [], companiesStr: '', loading: false }
  }

  componentDidMount = () => {

    getUser('me', getUserToken(),
      response => {
        let companyIds = []
        for (let company of response.data.companies) {
          companyIds.push(company)
        }

        getUsersCompanies(getUserToken(),
          response => {
            console.log('response->', response.data)
            this.setState({ userCompanyList: response.data })
          },
          error => {
            console.log('error:', error.message)
          }
        )

      },
      error => {
        console.log('error: ', error.message)
      }
    )

  }

  onChangeCompaniesStr = (e) => {
    this.setState({ companiesStr: e.target.value.toUpperCase()})
  }

  chooseCompanies = (e) => {
    let { companiesStr } = this.state
    let { userInfo } = this.props;
    e.preventDefault()

    let companyList = companiesStr.split(', ')

    updateUser(userInfo.id, getUserToken(), userInfo.email, companyList,
      response => {
        this.setState({companiesStr: '', userCompanyList: response.data.companies})
      },
      error => {
        console.log('error: ', error.message)
      }
    )

  }

  sendtoGraph = (company) => {
    let { stockChartXValues, stockChartYValues } = this.state

    console.log('>>> company', company)

    this.setState({loading: true})
    setTimeout(() => { this.setState({ loading: false }) }, 5000)

    getStoredStockData(company.id, getUserToken(),
      response => {
        let stockData = []
        stockData = response.data

        this.setState({ showGraph: true, selectedTicker: company.ticker })
        for (let i in stockData) {
          stockChartXValues.push(stockData[i].date)
          stockChartYValues.push(stockData[i].open)    
        }

      },
      error => {
        console.log('error->', error.message)
      }
    )
  }

  back = () => {
    this.setState({ showGraph: false, stockChartXValues: [], stockChartYValues: [], loading: false })
  }


  render() {
    let { userCompanyList, showGraph, selectedTicker, stockChartXValues, stockChartYValues, companiesStr, loading } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

              <div className="card__title">
                <h5 className="bold-text">{showGraph ? <Button size='sm' color='primary' onClick={this.back}>{"<-"}</Button> : "Home"}</h5>
              </div>

              {!showGraph && <div>
                {loading && <Spinner size='sm' color='primary'></Spinner>}

                <Form onSubmit={this.chooseCompanies}>
                  <Input bsSize='sm' name='companiesStr' placeholder='Enter Companies Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
                </Form>

                  <Table size='sm'>
                  <tbody>
                    {userCompanyList && userCompanyList.map((company, i) => <tr key={i}>
                      <td>{company.ticker}</td>
                      <td><Button size='sm' color='primary' disabled={loading} onClick={() => this.sendtoGraph(company)}>{"->"}</Button></td>
                    </tr>)}
                  </tbody>
                </Table>

                <sub>*Old companies will be removed upon selection of new companies</sub>
              </div>}

            {showGraph && <div>
              <Plot
                data={[
                  {
                    x: stockChartXValues,
                    y: stockChartYValues,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'red'},
                  }
                ]}
                layout={{width: 720, height: 440, title: selectedTicker}}
              />
            </div>}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);