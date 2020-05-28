import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Alert } from 'reactstrap';
import { getAllUser, deleteUser } from '../nodeserverapi'

class Users extends Component {
  constructor() {
    super();
    this.state = { result: undefined, userList: [] };
  }

  componentDidMount = () => {
    getAllUser(getUserToken(),
      response => {
        this.setState({ userList: response.data });
      },
      error => {
        this.setState({ result: error.message });
      }
    )
  }

  onDelete = (index, id) => {
    const { userList } = this.state
  
    deleteUser(id, getUserToken(),
      response => {
        if (id===this.props.userInfo.id) {
          this.props.clearUser();
        } else {
          userList.splice(index, 1);
          this.setState({ userList: userList });
        }
      },
      error => {
        this.setState({ result: error.message });
      }
    )
  }

  render() {
    const { result, userList } = this.state

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Users</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <div className="card__title">
                  <h5 className="bold-text">Users</h5>
                  <h5 className="subhead">Manage Users</h5>
                </div>

                {result && <Alert color="danger">{result}</Alert>}
                
                <table>
                  <tbody>
                    {userList.map((u, i) => <tr key={i}>
                      <td>{u.email}</td>
                      <td><Button onClick={()=>this.onDelete(i, u.id)}>x</Button></td>
                    </tr>)}
                  </tbody>
                </table>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>      
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Users);