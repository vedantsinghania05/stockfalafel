import React, { Component } from 'react';
import {Container, Card, CardBody, Button, Form, Input } from 'reactstrap'
import { getStock, saveStock } from '../nodeserverapi'
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
          this.saveStocks(data)

          console.log(data)
          data = []
        },
        error => {
          console.log(error.message)
        }
      )
    }
  }

  saveStocks = (stockList) => {

    for (let stock of stockList) {

      console.log(stock)

      saveStock(stock.symbol, stock.date, stock.open, stock.high, stock.low, stock.close, stock.volume,
        response => {
          console.log('YES!!->', response.data)
        },
        error => {
          console.log(error.message)
        }
      )

    }

  }

  /* componentDidMount() { 
     console.log('mounting')
     //this.fetchStock() 

     saveStock('test symbol', Date('6-6-20'), 20.1, 20.2, 20.3, 20.4, 20400,
      response => {
        console.log('YES!!->', response.data)
      },
      error => {
        console.log(error.message)
      }
     )
   }*/

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