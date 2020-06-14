import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input, FormGroup, Label } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, saveStock, saveManyStocks } from '../nodeserverapi'
import Plot from 'react-plotly.js'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { companies: [], companiesStr: '' }
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
    let { companies } = this.state

    getStock(getUserToken(), companies, 
      response => {
        console.log('response->', response.data)
      },
      error => {
        console.log(error.message)
      }
    )
    
  }

  render() {
    const { companiesStr } = this.state;

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


          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);