import React, { Component } from 'react';
import { Container, Card, CardBody, Spinner, Toast, ToastHeader, Table, Row, Col } from 'reactstrap'
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import errorAlert from './errorAlert.png'
import { getTopGainingStocks } from '../nodeserverapi'

class Home extends Component {
  constructor() {
    super();
    this.state = { loading: false, result: '', gainHigh: [], loseLow: [] }
  }

  componentDidMount = () => {
    this.getTopGainersData()
  }

  getTopGainersData = () => {
    console.log('getting top gainers/losers data')

    getTopGainingStocks(getUserToken(), 
      response => {
        console.log('YESSSSSSS', response.data)
      },
      error => {
        this.setState({ result: error.message })
      }
    )
  }

  removeResult = () => this.setState({result: ''})

  render() {
    let { loading, result, gainHigh, loseLow } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Home</h5>
            </div>
            {result && <Toast>
              <ToastHeader icon={<img src={errorAlert} alt='error' style={{height: 20, width: 20}}/>} toggle={this.removeResult}>{result}</ToastHeader>
            </Toast>}
            {loading && <Spinner size='sm' color='primary'></Spinner>}

            <Row>
              <Col>
                {gainHigh && <Table hover borderless size='sm'>
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Price</th>
                      <th>Change %</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gainHigh.map((u, i) => <tr key={i}>
                      <td>FB</td>
                      <td>$200</td>
                      <td>150%</td>
                      <td>Top Gainer</td>
                    </tr>)}
                  </tbody>
                </Table>}
              </Col>
              <Col>
                {loseLow && <Table hover borderless size='sm'>
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Price</th>
                      <th>Change %</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loseLow.map((u, i) => <tr key={i}>
                      <td>MSFT</td>
                      <td>$100</td>
                      <td>-120%</td>
                      <td>Top Loser</td>
                    </tr>)}
                  </tbody>
                </Table>}
              </Col>
            </Row>
           
          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);