import React, { Component } from 'react';
import { Form, Input, Container } from 'reactstrap'
import { getStock } from '../nodeserverapi'
import Plot from 'react-plotly.js'

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
    let stockChartXValuesFunction = [];
    let stockChartYValuesFunction = [];

    getStock(company,
      response => {
        console.log(response.data)
        for(var key in response.data['Time Series (Daily)']) {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(response.data['Time Series (Daily)'][key]['1. open']);
        }
        pointerToThis.setState({stockChartXValues: stockChartXValuesFunction, stockChartYValues: stockChartYValuesFunction})
      },
      error => {
      }
    )    

  }

  preventRefreshForFetch = (e) => {
    e.preventDefault()

    this.fetchStock()
  }

  render() {
    const { company } = this.state
    return (
      <Container className='dashboard'>
        <Plot
          data={[
            {
              x: this.state.stockChartXValues,
              y: this.state.stockChartYValues,
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
          ]}
          layout={ {width: 720, height: 440, title: 'Falafel Finder'} }
      />
        <Form onSubmit={this.preventRefreshForFetch}>
          <Input type='string' placeholder='Hit enter to get data' value={company} onChange={this.onChangeCompany}/>
        </Form>
      </Container>
    )
  }
}

export default Stock;