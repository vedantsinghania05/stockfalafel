import React, { Component } from 'react';
import { Container, Card, CardBody, InputGroup, Toast, ToastHeader, Input, Button, Table } from 'reactstrap'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { connect } from 'react-redux';
import { createShare, getShares, removeShares } from '../nodeserverapi'
import errorAlert from './errorAlert.png'

class Portfolio extends Component {
  constructor() {
    super();
    this.state = { result: '', ticker: '', amount: '', purchasedStocks: [] }
  }

  componentDidMount = () => {
    this.getShare()
  }

  onChangeTicker = (e) => this.setState({ticker: e.target.value.toUpperCase()})

  onChangeAmount = (e) => this.setState({amount: e.target.value})

  removeResult = () => this.setState({result: ''})


  submitPurchasedStocks = () => {
    let { ticker, amount, purchasedStocks } = this.state
    createShare(ticker, amount, this.props.userInfo.id,
      response => {
        purchasedStocks.push(response.data)
        this.setState({purchasedStocks: purchasedStocks, ticker: '', amount: ''})
        
      },
      error => {
        this.setState({result: error.message})
      }
    )
  }

  getShare = () => {
    let { purchasedStocks } = this.state
    getShares(getUserToken(), 
      response => {
        for (let i of response.data) purchasedStocks.push(i)
        this.setState({purchasedStocks: purchasedStocks})
      },
      error => {
        this.setState({result: error.message})
      }
    )
  }

  soldStock = (u,i) => {
    let {purchasedStocks} = this.state
    removeShares(u.id, getUserToken(),
      response => {
        purchasedStocks.splice(i, 1)
        this.setState({purchasedStocks: purchasedStocks})

      },
      error => {
        this.setState({result: error.message})
      }
    )
  }


  render() {
    let { result, ticker, amount, purchasedStocks } = this.state

    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Portfolio</h5>
            </div>

            {result && <Toast>
              <ToastHeader icon={<img src={errorAlert} alt='error' style={{height: 20, width: 20}}/>} toggle={this.removeResult}>{result}</ToastHeader>
            </Toast>}

            <InputGroup>
              <Input type='string' placeholder='Ticker' bsSize='sm' value={ticker} onChange={this.onChangeTicker}/>
              <Input type='number' placeholder='Amount' bsSize='sm' value={amount} onChange={this.onChangeAmount}/>
            </InputGroup>
                  
            <Button size='sm' color='primary' onClick={this.submitPurchasedStocks}>Submit</Button>

            {purchasedStocks.length >= 1 && <Table borderless hover size='sm'>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Amount</th>
                    <th>Date of Buy</th>
                    <th>Price @ Buy</th>
                    <th>Current Price</th>
                    <th>Profit Per</th>
                    <th>Profit For All</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasedStocks.map((u, i) => <tr key={i}>
                    <td>{u.company}</td>
                    <td>{u.amount}</td>
                    <td>{u.date.split('T')[0]}</td>
                    <td>{'$' + u.price}</td>
                    <td>{'$' + u.cp}</td>
                    <td>{'$' + u.pp}</td>
                    <td>{'$' + u.pa}</td>
                    <th><Button size='sm' color='primary' onClick={() => this.soldStock(u,i)}>x</Button></th>
                  </tr>)}
                </tbody>
              </Table>}
    
          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Portfolio);
