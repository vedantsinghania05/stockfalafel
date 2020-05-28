import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../redux/containers/SignedInUserCtr';

class SignOut extends Component {
  componentDidMount = () => {
    this.props.clearUser();
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(SignOut);