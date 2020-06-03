import React, { Component } from 'react';
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

  render() {
    const {company} = this.state
    return (
      <div>
        <h1>Stock Market</h1>
        <input type='string' value={company} onChange={this.onChangeCompany}/>
        <button onClick={() => this.fetchStock()}>Update Stock</button>
      </div>
    )
  }
}

export default Stock;
