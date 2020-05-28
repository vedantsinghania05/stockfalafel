import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../redux/containers/SignedInUserCtr';
import { Col, Container, Row, Card, CardBody, Button, Form, InputGroup, InputGroupAddon, Input, ButtonGroup } from 'reactstrap';
import { getGroupInfo, getMember, updateTitleGroup, updateMembersGroup, getUser, deleteGroup, deleteGroupsMessage, updateCreatorGroup, getValidUsers } from '../nodeserverapi'
import { groupPrefixes, groupPrefixes2, groupRoots } from './GroupNames';
import { Redirect } from 'react-router-dom'


class ManageGroups extends Component {
  constructor() {
    super();
    this.state = { groupsMembers: [], groupInfo: undefined, newMember: '', newGroupTitle: '', 
    confirm: false, redirect: false, confirm1: false, redirect1: false };
	}
	
	componentDidMount = () => {
    getGroupInfo(getUserToken(), this.props.location.state.groupId,
      response => {
        let groupInfo = response.data
        this.getMembers(groupInfo.id)
        this.setState({ groupInfo: groupInfo, newGroupTitle: groupInfo.title })
      },
      error => {
      }
    )

  }

  componentDidUpdate = (prevProps) => {
    const { location } = this.props

    let newGroupId = location.state ? location.state.groupId : undefined
    let oldGroupId = prevProps.location.state ? prevProps.location.state.groupId : undefined

    if (newGroupId && newGroupId!==oldGroupId) {
      getGroupInfo(getUserToken(), this.props.location.state.groupId,
        response => {
          let groupInfo = response.data
          this.getMembers(groupInfo.id)
          this.setState({ groupInfo: groupInfo, newGroupTitle: groupInfo.title })
        },
        error => {
        }
      )
    }
  }

  onChangeNewMember = (e) => {
    this.setState({ newMember: e.target.value })
  }
  
  onChangeNewGroupTitle = (e) => {
    this.setState({ newGroupTitle: e.target.value })
  }

  addMembers = (e) => {
    e.preventDefault()
    const { groupInfo, newMember } = this.state;

    getValidUsers(getUserToken(), [newMember],
      response => {
        let validUsers = response.data
        
        if (validUsers.length !== 0) {
          updateMembersGroup(getUserToken(), groupInfo.id, true, newMember,
            response => {
              if (response.data) {        
                this.getMembers(groupInfo.id)
                this.setState({ groupInfo: response.data, newMember: '' })
              }
            },
            error => {
            }
          )
        }
      },
      error => {
      }
    )

  }

  deleteGroupMember = (member, i) => {
    const { groupInfo } = this.state;

      updateMembersGroup(getUserToken(), groupInfo.id, false, member.email,
        response => {
          this.getMembers(groupInfo.id)
          this.setState({ groupInfo: response.data })
        },
        error => {
        }
      )
  }
  
  getMembers = (groupId) => {
    getMember(getUserToken(), groupId,
      response => {
        this.setState({ groupsMembers: response.data })
      },
      error => {
      }
    )
  }

  updateGroupTitle = (e) => {
    e.preventDefault()
    const { newGroupTitle, groupInfo } = this.state;
    if (newGroupTitle && newGroupTitle[0] !== ' ') {
      updateTitleGroup(getUserToken(), groupInfo.id, newGroupTitle,
        response => {
          this.setState({ groupInfo: response.data })
          
          getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
        },
        error => {
        }
      )
    }
  }

  randomizeNewGroupTitle = () => {
    const { groupInfo } = this.state;

    let listOneLength = groupPrefixes.length
    let listTwoLength = groupPrefixes2.length
    let listThreeLength = groupRoots.length
    
    let prefixOneIndex = Math.floor(Math.random() * Math.floor(listOneLength))
    let prefixTwoIndex = Math.floor(Math.random() * Math.floor(listTwoLength))
    let rootIndex = Math.floor(Math.random() * Math.floor(listThreeLength))

    let prefixOne = groupPrefixes[prefixOneIndex]
    let prefixTwo = groupPrefixes2[prefixTwoIndex]
    let root = groupRoots[rootIndex]

    let initGroupsRandomizedTitle = prefixOne + ' ' + prefixTwo + ' ' + root
    let groupsRandomizedTitle = initGroupsRandomizedTitle.trim()

    updateTitleGroup(getUserToken(), groupInfo.id, groupsRandomizedTitle,
      response => {
        this.setState({ groupInfo: response.data, newGroupTitle: groupsRandomizedTitle })
        
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
      },
      error => {
      }
    )    
  }

  removeGroup = () => {
    const { groupInfo } = this.state
    deleteGroup(getUserToken(), groupInfo.id,
      response => {
        this.removeGroupsMessages()
        this.setState({redirect: true})
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
      },
      error => {
      }
    )
  }

  removeGroupsMessages = () => {
    const { groupInfo } = this.state;
    
    deleteGroupsMessage(getUserToken(), groupInfo.id,
      response => {
      },
      error => {
      }
    )

  }

  updateGroupCreator = (member, i) => {
    const{ groupInfo } = this.state
    updateCreatorGroup(getUserToken(), groupInfo.id, member.id, 
      response => {
        getUser(this.props.userInfo.id, getUserToken(),
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
        this.setState({redirect1: true})
      },
      error => {
      }
    )
  }

  confirmBool = () => {
    const {confirm} = this.state
    this.setState({confirm: !confirm})
  }

  confirmBool1 = () => {
    const {confirm1} = this.state
    this.setState({confirm1: !confirm1})
  }

  render() {
		const { groupsMembers, newMember, newGroupTitle, groupInfo, confirm, redirect, redirect1, confirm1 } = this.state;

    return (
      <Container className="dashboard">
        <Row>
          <Col md={12}>
            <br></br>
            <Row md='auto'>
            <Form onSubmit={this.updateGroupTitle}>
              <InputGroup size='sm'>
                <InputGroupAddon addonType="prepend"><p>     </p></InputGroupAddon>
                <Input name="newGroupTitle" placeholder='enter a group title' value={newGroupTitle} onChange={this.onChangeNewGroupTitle}/>
                <InputGroupAddon addonType="append"><Button color='primary' onClick={this.randomizeNewGroupTitle}>Randomize</Button></InputGroupAddon>
              </InputGroup>                 
            </Form>
            </Row>
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>

                <Form onSubmit={this.addMembers}>
                  <input className='input'
                    name="newMember"
                    placeholder="add user to group"
                    value={newMember}
                    onChange={this.onChangeNewMember}
                  />                    
                </Form>

                <hr></hr>

                <table>
                  <tbody>
                    {groupsMembers.map((member, index) => <tr key={index}>
                      <td>{groupInfo.creator !== member.id ? <Button color='primary' onClick={()=>this.deleteGroupMember(member, index)}>x</Button> : <Button disabled>x</Button>}</td>
                      <td>{member.email}</td>
                      {groupInfo.creator !== member.id && !confirm1 && <td><Button onClick={this.confirmBool1} color='primary' size='sm'>Make Admin</Button></td>}
                      {groupInfo.creator !== member.id && confirm1 && <td><ButtonGroup size='sm'>
                        <Button onClick={()=>this.updateGroupCreator(member, index)} color='danger'>{redirect1 && <Redirect to='/' />}Confirm</Button>
                        <Button onClick={this.confirmBool1} color='primary'>Cancel</Button> 
                      </ButtonGroup></td>}
                    </tr>)}
                  </tbody>	
                </table>	
                {!confirm && <Button onClick={this.confirmBool} size='sm' color='primary'>Delete Group</Button>}
                {confirm && <ButtonGroup size='sm'>
                  <Button onClick={this.removeGroup} color='danger'>{redirect && <Redirect to='/' />}Confirm</Button>
                  <Button onClick={this.confirmBool} color='primary'>Cancel</Button> 
                </ButtonGroup>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>    
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(ManageGroups);