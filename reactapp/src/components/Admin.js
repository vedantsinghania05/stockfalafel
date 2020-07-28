import React, { Component } from 'react';
import { Container, Card, CardBody, Button, Form, Input, Spinner, Toast, ToastHeader, Row, Col, Table } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, createCompany, getAllCompany, deleteCompany } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import errorAlert from './errorAlert.png'

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
    let ticker= company.ticker

    deleteCompany(getUserToken(), ticker,
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

            {result && <Toast>
              <ToastHeader icon={<img src={errorAlert} alt='error' style={{height: 20, width: 20}}/>} toggle={this.removeResult}>{result}</ToastHeader>
            </Toast>}
            {loading && <Spinner size='sm' color='primary'></Spinner>}

            <Row><Col xs={4}><Form onSubmit={this.createCompanies}>
              <Input bsSize='sm' name='companyStr' placeholder='Enter Company Here' value={companyStr} onChange={this.onChangecompanyStr}/>
            </Form></Col></Row>

            <Table hover borderless size='sm'>
              <tbody>
                {companyData.map((company, i) => <tr key={i}>
                  <td>{company.ticker}</td>
                  <td><Button size='sm' color='primary' disabled={loading} onClick={() => {this.updateStock(company)}}>Update</Button>
                  <Button size='sm' color='danger' disabled={loading} onClick={() => {this.removeCompany(company)}}>X</Button></td>
                </tr>)}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Admin);