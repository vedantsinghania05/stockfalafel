import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Form, Input, Spinner, Alert } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, createCompany, getAllCompany, deleteCompany } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Admin extends Component {
  constructor() {
    super();
    this.state = { companyData: [], companyStr: '', loading: false, result: '' }
  }

  componentDidMount = () => this.getCompanies()

  onChangecompanyStr = (e) => {
    this.setState({ companyStr: e.target.value.toUpperCase()})
  }

  updateStock = (company) => { 
    let formattedCompanyData = ({ id: company._id, ticker: company.ticker })
    this.setState({ loading: true })

     getStock(getUserToken(), formattedCompanyData, 
       response => {
         this.getCompanies()
         this.setState({ loading: false })
       },
       error => {
         this.setState({result: error.message})
       } 
     )
  }

  createCompanies = (e) => {
    let { companyStr } = this.state
    e.preventDefault()
    if (companyStr && companyStr[0] !== ' ') {

      createCompany(companyStr,
        response => {
          this.setState({ companyStr: ''})
          this.getCompanies()
        },
        error => {
          this.setState({result: error.message, companyStr: ''})
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
        this.setState({result: error.message})
      }
    )
  }

  removeCompany = (company) => {
    let id = company._id
    deleteCompany(id, getUserToken(),
      response => {
        this.getCompanies()
      },
      error => {
        this.setState({result: error.message})
      }
    )
  }

  removeResult =() => this.setState({result: ''})


  render() {
    let { companyData, companyStr, loading, result } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <div className="card__title">
              <h5 className="bold-text">Admin</h5>
            </div>

            {loading && <Spinner size='sm' color='primary'></Spinner>}
            {result && <Alert toggle={this.removeResult} color='danger' size='sm' >{result}</Alert>}

            <Form onSubmit={this.createCompanies}>
              <Input bsSize='sm' name='companyStr' placeholder='Enter Company Here' value={companyStr} onChange={this.onChangecompanyStr}/>
            </Form>

            <table>
              <tbody>
                {companyData.map((company, i) => <tr key={i}>
                  <td>{company.ticker}</td>
                  <td><Button size='sm' color='primary' disabled={loading} onClick={() => {this.updateStock(company)}}>Update</Button></td>
                  <td><Button size='sm' color='danger' disabled={loading} onClick={() => {this.removeCompany(company)}}>X</Button></td>
                </tr>)}
              </tbody>
            </table>

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Admin);