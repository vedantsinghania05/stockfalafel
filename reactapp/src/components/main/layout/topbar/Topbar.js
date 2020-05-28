import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';

class Topbar extends Component {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <div className="topbar__logo">
              <span className="account__logo">Chatter
                <span className='account__logo-accent2'>Box</span>
              </span> 
            </div>           
          </div>
          <div className="topbar__right">
            <TopbarProfile />
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
