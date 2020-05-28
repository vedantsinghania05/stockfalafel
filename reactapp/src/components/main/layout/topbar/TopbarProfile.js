import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../../../../redux/containers/SignedInUserCtr';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';

//const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

class TopbarProfile extends Component {
  constructor() {
    super();
    this.state = {
      collapse: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  render() {
    const { collapse } = this.state;

    return (
      <div className="topbar__profile">
        <button type="button" className="topbar__avatar" onClick={this.toggle}>
          {/*<img className="topbar__avatar-img" src={Ava} alt="avatar" />*/}
          <p className="topbar__avatar-name">{this.props.userInfo.email}</p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button type="button" className="topbar__back" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            {/*<TopbarMenuLink title="Home" icon="home" path="/" />
            <div className="topbar__menu-divider" />*/}
            <TopbarMenuLink title="Sign Out" icon="exit" path="/signout" />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(TopbarProfile);