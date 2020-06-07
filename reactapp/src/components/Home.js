import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input } from 'reactstrap'
import { getStock } from '../nodeserverapi'
import Plot from 'react-plotly.js'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { company: ["COF", "FB", "AMZN", "AAPL", "GOOGL"], data: [], stockChartXValues: [], stockChartYValues: [], symbol: '', displayApiMax: false }
  }

  updateStock = () => {
    let { company, data } = this.state
    for (let i in company) {
      getStock(company[i], 
        response => {
          console.log(response.data)
        },
        error => {
          console.log(error.message)
        }
      )
    }
  }

  // componentDidMount() { 
  //   this.fetchStock() 
  // }

  // onChangeCompany = (e) => this.setState({ company: e.target.value })

  // fetchStock = () => {
  //   let { company } = this.state
  //   let stockChartXValuesFunction = [], stockChartYValuesFunction = []
  //   getStock(company,
  //     response => {
  //       console.log(response.data)
  //       if (response.data.Note) {
  //         this.setState({displayApiMax: true})
  //       } else {
  //         for(var key in response.data['Time Series (Daily)']) {
  //           stockChartXValuesFunction.push(key);
  //           stockChartYValuesFunction.push(response.data['Time Series (Daily)'][key]['1. open']);
  //         }
  //         this.setState({ })
  //         this.setState({stockChartXValues: stockChartXValuesFunction, stockChartYValues: stockChartYValuesFunction, symbol: ": " + response.data['Meta Data']["2. Symbol"].toUpperCase()})
  //       } 
  //     },
  //     error => {}
  //   )    
  // }

  // preventRefreshForFetch = (e) => {
  //   e.preventDefault()

  //   this.fetchStock()
  // }

  render() {
    const { company, stockChartXValues, stockChartYValues, symbol, displayApiMax } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>

            <p>Home</p>
            <Button onClick={this.updateStock}>Update Stocks</Button>

            {/* {displayApiMax && <Alert color='danger'>Please try again in one minute</Alert>}
            <Plot
              data={[{
                x: stockChartXValues,
                y: stockChartYValues,
                mode: 'lines+markers',
                marker: {color: '#8ED1FC'}
              }]}
              layout={{ title: `Falafel Finder${symbol}` }}
            /> 

            <Form onSubmit={this.preventRefreshForFetch}>
              <Input type='string' placeholder='Hit enter to get data' value={company} onChange={this.onChangeCompany}/>
            </Form> */}

          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default Home;