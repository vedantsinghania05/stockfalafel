import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input, FormGroup, Label, Table } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, createCompany, getAllCompany } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { tickers: ["COF", "FB", "AMZN", "AAPL", "GOOGL"], companyList: [], companiesStr: '' }
  }

  componentDidMount = () => {
    this.getCompanies()
  }

  onChangeCompaniesStr = (e) => {
    console.log(e.target.value)
    this.setState({ companiesStr: e.target.value })
  }

  addCompanies = (e) => {
    e.preventDefault()
    const { companiesStr } = this.state;

    let companiesList = companiesStr.split(', ')

    this.setState({ companiesStr: '', companies: companiesList })
  }

  updateStock = () => {
    let { tickers } = this.state
    getStock(getUserToken(), tickers, 
      response => {
        console.log('response->', response.data)
      },
      error => {
        console.log(error.message)
      }
    )
  }

  createCompanies = () => {
    let { tickers } = this.state
    createCompany(tickers,
      response => {
        console.log('response->', response.data)
        this.setState({ companyList: response.data})
      },
      error => {
        console.log(error.message)
      }
    )
  }

  getCompanies = () => {
    getAllCompany(getUserToken(),
      response => {
        console.log('response->', response.data)
        this.setState({ companyList: response.data})
      },
      error => {
        console.log(error.message)
      }
    )
  }


  render() {
    let { companyList, companiesStr } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <Form onSubmit={this.addCompanies}>
              <FormGroup>
                <Label>Add Companies</Label>
              </FormGroup>
              <FormGroup>
                <Input name='companiesStr' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
              </FormGroup>
            </Form>

            <p>Home</p>

            <Button size='sm' color='primary' onClick={this.updateStock}>Update Stocks</Button>
            <Button size='sm' color='primary' onClick={this.createCompanies}>Create Companies</Button>

            <Table size='sm'>
              <thead>
                <tr>
                  <th>Companies</th>
                </tr>
              </thead>
              <tbody>
                {companyList.map((company, i) => <tr key={i}>
                  <td>{company.ticker}</td>
                </tr>)}
              </tbody>
            </Table>

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);