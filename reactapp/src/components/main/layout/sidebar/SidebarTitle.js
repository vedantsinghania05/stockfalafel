import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';

const SidebarTitle = ({
  title,
}) => (
  <CardTitle>
    <li className="sidebar__link">
      <p className="sidebar__title">
        {title}
      </p>
    </li>
  </CardTitle>
);

SidebarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
export default SidebarTitle;
