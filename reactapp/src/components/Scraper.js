import React, { Component } from 'react';
import { Container, Card, CardBody } from 'reactstrap'
import { connect } from 'react-redux';
import { scrapeFn } from '../nodeserverapi'
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
const cheerio = require('cheerio')

class Scraper extends Component {
  constructor() {
    super();
    this.state = {  }
  }

  

  render() {
    let {  } = this.state
    return (
      <Container className='dashboard'>
        <Card>
          <CardBody>



          </CardBody>
        </Card>
      </Container>
    )
  }
}
export default connect(signedInUserMstp, signedInUserMdtp)(Scraper);