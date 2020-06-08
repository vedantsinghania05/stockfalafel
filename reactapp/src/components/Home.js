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
          for (let a in response.data['Time Series (Daily)']) {
            data.push({
              symbol: response.data['Meta Data']["2. Symbol"], 
              date: a,
              open: response.data['Time Series (Daily)'][a]['1. open'],
              high: response.data['Time Series (Daily)'][a]['2. high'],
              low: response.data['Time Series (Daily)'][a]['3. low'],
              close: response.data['Time Series (Daily)'][a]['4. close'],
              volume: response.data['Time Series (Daily)'][a]['6. volume']
            })
          }
          //put post function here
          console.log(data)
          data = []
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

  fetchStock = () => {
    let { company } = this.state
    let stockChartXValuesFunction = [], stockChartYValuesFunction = []
    getStock(company,
      response => {
        console.log(response.data)
        if (response.data.Note) {
          this.setState({displayApiMax: true})
        } else {
          for(var key in response.data['Time Series (Daily)']) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(response.data['Time Series (Daily)'][key]['1. open']);
          }
          this.setState({ })
          this.setState({stockChartXValues: stockChartXValuesFunction, stockChartYValues: stockChartYValuesFunction, symbol: ": " + response.data['Meta Data']["2. Symbol"].toUpperCase()})
        } 
      },
      error => {}
    )    
  }
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
            <Button size='sm' color='primary' onClick={this.updateStock}>Update Stocks</Button>

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