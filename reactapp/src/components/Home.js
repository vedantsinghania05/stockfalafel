import React, { Component } from 'react';
import { Container, Card, CardBody, Spinner, Toast, ToastHeader, Table } from 'reactstrap'
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../redux/containers/SignedInUserCtr';
import errorAlert from './errorAlert.png'

class Home extends Component {
  constructor() {
    super();
    this.state = { loading: false, result: '' }
  }

  removeResult =() => this.setState({result: ''})

  render() {
    let { loading, result } = this.state
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


            <Table hover borderless size='sm'>
              <tbody>
                <tr>
                  <td>FB</td>
                  <td>Top Gainer</td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Home);