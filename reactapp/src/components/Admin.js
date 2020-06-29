import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Form, Input, Spinner } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, createCompany, getAllCompany, deleteCompany } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Admin extends Component {
  constructor() {
    super();
    this.state = { companyData: [], companyStr: '', loading: false }
  }

  componentDidMount = () => { 
    this.getCompanies()
  }

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
         console.log(error.message)
       } 
     )
  }

  createCompanies = (e) => {
    let { companyStr } = this.state
    e.preventDefault()
    if (companyStr && companyStr[0] !== ' ') {

      this.setState({loading: true})

      createCompany(companyStr,
        response => {
          this.setState({ companyStr: '', loading: false})
          this.getCompanies()
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

  removeCompany = (company) => {
    let id = company._id
    deleteCompany(id, getUserToken(),
      response => {
        this.getCompanies()
      },
      error => {
        console.log(error.message)
      }
    )
  }


  render() {
    let { companyData, companyStr, loading } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <div className="card__title">
              <h5 className="bold-text">Admin</h5>
            </div>

            {loading && <Spinner size='sm' color='primary'></Spinner>}

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