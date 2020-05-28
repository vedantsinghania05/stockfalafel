import React, { Component } from "react";
import PropTypes from "prop-types";
import SidebarLink from "./SidebarLink";
import SidebarTitle from "./SidebarTitle";
import { connect } from "react-redux";
import { Form, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap"
import { signedInUserMstp, signedInUserMdtp, getUserToken } from "../../../../redux/containers/SignedInUserCtr";
import { getUser, createGroup, getValidUsers } from "../../../../nodeserverapi"
import { groupPrefixes, groupPrefixes2, groupRoots } from "../../../GroupNames";
class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [], groupsInitUsers: [], toggle: false };
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };
  componentDidMount = () => {
    getUser(this.props.userInfo.id, getUserToken(),
      response => {
      },
      error => {
      }
    )
    let usersGroups = this.props.userInfo && this.props.userInfo.groups ? this.props.userInfo.groups : []
    this.setState({ groupList: usersGroups })
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.userInfo && prevProps.userInfo.groups !== this.props.userInfo.groups) {
      this.setState({ groupList: this.props.userInfo.groups })
    }
  }
  onChangeGroupsInitUsers = (e) => {
    this.setState({ groupsInitUsers: e.target.value })
  }

  createNewGroup = (e) => {
    e.preventDefault()
    const { groupsInitUsers, groupList } = this.state;
    let emailsToAdd = this.parseForUserEmails(groupsInitUsers)
    
    let emailIndex = 0
    for (let email of emailsToAdd) {
      if (email === this.props.userInfo.email) {
        emailsToAdd.splice(emailIndex, 1)
      }
      emailIndex++
    }
    if (emailsToAdd.length !== 0) {

      let validUserEmails = []
      let validUsers = []
      getValidUsers(getUserToken(), emailsToAdd,
        response => {
          validUsers = response.data
          if (validUsers.length > 0) {
            for (let user of validUsers) {
              validUserEmails.push(user.email)
            }
            validUserEmails.unshift(this.props.userInfo.email)
            let listOneLength = groupPrefixes.length
            let listTwoLength = groupPrefixes2.length
            let listThreeLength = groupRoots.length
            let prefixOneIndex = Math.floor(Math.random() * Math.floor(listOneLength))
            let prefixTwoIndex = Math.floor(Math.random() * Math.floor(listTwoLength))
            let rootIndex = Math.floor(Math.random() * Math.floor(listThreeLength))
            let prefixOne = groupPrefixes[prefixOneIndex]
            let prefixTwo = groupPrefixes2[prefixTwoIndex]
            let root = groupRoots[rootIndex]
            let initGroupsDefaultTitle = prefixOne + ' ' + prefixTwo + ' ' + root
            let groupsDefaultTitle = initGroupsDefaultTitle.trim()
            createGroup(groupsDefaultTitle, validUserEmails, this.props.userInfo.id,
              response => {
                groupList.push(response.data)
                this.setState({ groupsInitUsers: "" })
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
          } else {
            this.setState({ groupsInitUsers: "" })
          }
        },
        error => {
        }
      )
    }
  }
  parseForUserEmails = (emailsString) => {
    let emailsList = emailsString.split(/[ ,]+/)
    for (let email of emailsList) {
      email = email.trim()
    }
    return emailsList
  }
  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };
  toggleModal =() => {
    const {toggle} = this.state
    this.setState({toggle: !toggle})
  }
  render() {
    const { groupList, groupsInitUsers, toggle } = this.state;
    return (
      <span>
        <br/>
        <Row>
          <Col md={6}>
            <ul><SidebarTitle title="Groups" /></ul>
          </Col>
          <Col md="auto">
          <Button size='sm' onClick={this.toggleModal} color='primary'>+</Button>
          </Col>
        </Row>
          <Modal isOpen={toggle}>
            <ModalHeader toggle={this.toggleModal}>Create Group</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.createNewGroup}>
                <Input bsSize="sm"
                name='groupsInitUsers'
                placeholder='enter user(s) - hit enter to create'
                value={groupsInitUsers}
                onChange={this.onChangeGroupsInitUsers}
                />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" color="primary" onClick={this.createNewGroup}>Submit</Button>   
              <Button size="sm" color="primary" onClick={this.toggleModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
          {/*<ul className=“sidebar__block”>
            <SidebarLink title=“Log Out” icon=“exit” route=“/signin” onClick={this.hideSidebar} />
          </ul>*/}
          {groupList.map((group, index) =>
            <ul key={index}>
              <SidebarLink key={index} title={group.title} to={{pathname:"/", state: {groupId: group._id}, backtoGroup: false}} onClick={this.hideSidebar} />
            </ul>
          )}
      </span>
    );
  }
}
export default connect(signedInUserMstp, signedInUserMdtp) (SidebarContent);
