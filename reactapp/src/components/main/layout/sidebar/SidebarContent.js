import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signedInUserMstp, signedInUserMdtp } from "../../../../redux/containers/SignedInUserCtr";

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = { groupList: [], groupsInitUsers: [], toggle: false };
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <span>
      </span>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(SidebarContent);
