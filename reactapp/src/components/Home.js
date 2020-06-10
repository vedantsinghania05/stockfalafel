import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input } from 'reactstrap'
import { connect } from 'react-redux';
import { getStock, saveStock, saveManyStocks } from '../nodeserverapi'
import Plot from 'react-plotly.js'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { company: ["COF", "FB", "AMZN", "AAPL", "GOOGL"] }
  }

  updateStock = () => {
    let { company } = this.state

      getStock(getUserToken(), company, 
        response => {
          console.log('response->', response.data)
        },
        error => {
          console.log(error.message)
        }
      )
    
  }

  render() {

    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <p>Home</p>
            <Button size='sm' color='primary' onClick={this.updateStock}>Update Stocks</Button>


          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);