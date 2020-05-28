import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../redux/containers/SignedInUserCtr';
import { Col, Row, Card, Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <Card>              
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);