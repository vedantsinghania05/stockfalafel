import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SidebarContent from './SidebarContent';

import Scrollbar from 'react-smooth-scrollbar';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';

class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'disableScroll';
  static defaultOptions = {
    direction: null,
  };
  transformDelta(delta) {
    if (this.options.direction) {
      delta[this.options.direction] = 0;
    }
    return { ...delta };
  }
}
SmoothScrollbar.use(DisableScrollPlugin);


const Sidebar = ({
  changeMobileSidebarVisibility, sidebarShow, sidebarCollapse,
}) => {
  const sidebarClass = classNames({
    sidebar: true,
    'sidebar--show': sidebarShow,
    'sidebar--collapse': sidebarCollapse,
  });

  return (
    <div className={sidebarClass}>
      <button type="button" className="sidebar__back" onClick={changeMobileSidebarVisibility} />
      <Scrollbar plugins={{disableScroll: { direction: 'x' }}} className="sidebar__scroll scroll">
        <div className="sidebar__wrapper sidebar__wrapper--desktop">
          <SidebarContent
            onClick={() => {}}
          />
        </div>
        <div className="sidebar__wrapper sidebar__wrapper--mobile">
          <SidebarContent
            onClick={changeMobileSidebarVisibility}
          />
        </div>
      </Scrollbar>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarShow: PropTypes.bool.isRequired,
  sidebarCollapse: PropTypes.bool.isRequired,
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};

export default Sidebar;
