import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input, Spinner } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, createCompany, getAllCompany } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Admin extends Component {
  constructor() {
    super();
    this.state = { companyData: [], companiesStr: '', loading: false }
  }

  componentDidMount = () => { 
    this.getCompanies()
  }

  onChangeCompaniesStr = (e) => {
    this.setState({ companiesStr: e.target.value.toUpperCase()})
  }

  updateStock = () => { 
    let { companyData } = this.state

    let formattedCompanyData = []

    for (let company of companyData) {
      formattedCompanyData.push({ id: company._id, ticker: company.ticker })
    }

    getStock(getUserToken(), formattedCompanyData, 
      response => {
        this.getCompanies()
      },
      error => {
        console.log(error.message)
      } 
    )
  }

  createCompanies = (e) => {
    let { companiesStr } = this.state
    e.preventDefault()
    if (companiesStr && companiesStr[0] !== ' ') {

      this.setState({loading: true})
      setTimeout(() => { this.setState({ loading: false }) }, 5000)

      createCompany(companiesStr.split(', '),
        response => {
          this.setState({ companyData: response.data, companiesStr: ''})
        },
        error => {
          console.log(error.message)
        }
      )
    }
  }

  getCompanies = () => {
    getAllCompany(getUserToken(),
      response => {
        this.setState({ companyData: response.data})
      },
      error => {
        console.log(error.message)
      }
    )
  }


  render() {
    let { companyData, companiesStr, loading } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <div className="card__title">
              <h5 className="bold-text">Admin</h5>
            </div>

            {loading && <Spinner size='sm' color='primary'></Spinner>}

            <Form onSubmit={this.createCompanies}>
              <Input bsSize='sm' name='companiesStr' placeholder='Enter Companies Here' value={companiesStr} onChange={this.onChangeCompaniesStr}/>
            </Form>

            <Button size='sm' color='primary' disabled={loading} onClick={this.updateStock}>Update Stock Data</Button>

            <table>
              <thead>
                <tr>
                  <th>Companies</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((company, i) => <tr key={i}>
                  <td>{company.ticker}</td>
                </tr>)}
              </tbody>
            </table>

            <sub>*Old companies will be removed upon selection of new companies</sub>
            <sub>**Remember to only create new stocks after 1 min of inactivity</sub>

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Admin);