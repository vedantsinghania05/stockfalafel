import React, { Component } from 'react';
import { Form, Input, Container } from 'reactstrap'
import { getStock } from '../nodeserverapi'

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = { company: 'AMZN', stockChartXValues: [], stockChartYValues: [] }
  }

  componentDidMount() {
    this.fetchStock();
  }

  onChangeCompany = (e) => {
    this.setState({company: e.target.value})
  }

  fetchStock = () => {
    let {company} = this.state
    const pointerToThis = this;
    console.log(pointerToThis);
    let stockChartXValuesFunction = [];
    let stockChartYValuesFunction = [];

    getStock(company,
      response => {
        console.log(response.data)
        for(var key in response.data['Time Series (Daily)']) {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(response.data['Time Series (Daily)'][key]['1.open']);
        }
        // console.log(stockChartXValuesFunction);
        pointerToThis.setState({stockChartXValues: stockChartXValuesFunction, stockChartYValues: stockChartYValuesFunction})
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
      <Container className='dashboard'>

        <h3>Stock Tracker</h3>
        <Form onSubmit={this.preventRefreshForFetch}>
          <Input type='string' placeholder='Hit enter to get data' value={company} onChange={this.onChangeCompany}/>
        </Form>

      </Container>
    )
  }
}

export default Stock;