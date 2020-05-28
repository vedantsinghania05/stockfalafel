import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Form, FormGroup } from 'reactstrap';

class Home extends Component {
  constructor() {
    super();
    this.state = { messages: [], newMessage: '' };
  }

  onChangeNewMessage = (e) => {
    this.setState({ newMessage: e.target.value })
  }

  render() {
    const { newMessage } = this.state

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">{this.props.history.location.state.groupId}</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Form>
                  <FormGroup>
                    <input
                      name="newMessage"
                      type="string"
                      placeholder="enter message"
                      value={newMessage}
                      onChange={this.onChangeNewMessage}
                    />
                  </FormGroup>
                </Form>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>      
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Home);