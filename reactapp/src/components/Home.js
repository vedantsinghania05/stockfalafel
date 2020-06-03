import React, { Component } from 'react';
import { Form, Input } from 'reactstrap'
import { getStock } from '../nodeserverapi'

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = { company: 'AMZN' }
  }

  componentDidMount() {
    this.fetchStock();
  }

  onChangeCompany = (e) => {
    this.setState({company: e.target.value})
  }

  fetchStock = () => {

    let {company} = this.state
    getStock(company,
      response => {
        console.log(response.data)
      },
      error => {
        console.log(error.message)
      }
    )    

  }

  preventRefreshForFetch = (e) => {
    e.preventDefault()
    this.fetchStock()
  }

  render() {
    const {company} = this.state
    return (
      <div>
        <h1>Stock Market</h1>

        <Form onSubmit={this.preventRefreshForFetch}>
          <Input type='string' value={company} onChange={this.onChangeCompany}/>
        </Form>

      </div>
    )
  }
}

export default Stock;
