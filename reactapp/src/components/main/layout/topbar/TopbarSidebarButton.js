import React, { Component } from 'react';
import PropTypes from 'prop-types';
import menu from '../../../menu.png'

// const icon = `${process.env.PUBLIC_URL}/img/burger.svg`;

class TopbarSidebarButton extends Component {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

    return (
      <div>
        <button type="button" className="topbar__button topbar__button--desktop" onClick={changeSidebarVisibility}>
          <img src={menu} alt="hello" className="topbar__button-icon" />
        </button>
        <button type="button" className="topbar__button topbar__button--mobile" onClick={changeMobileSidebarVisibility}>
          <img src={menu} alt="" className="topbar__button-icon" />
        </button>
      </div>
    );
  }
}

export default TopbarSidebarButton;
