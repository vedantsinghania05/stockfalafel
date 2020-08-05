import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title="Home" route="/" onClick={this.hideSidebar} />
          <SidebarLink title="My Stocks" route="/mystocks" onClick={this.hideSidebar} />
          <SidebarLink title='Admin' route='/admin' onClick={this.hideSidebar} />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
