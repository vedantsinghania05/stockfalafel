import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp, getUserToken } from '../../redux/containers/SignedInUserCtr';
import '../../scss/app.scss';
import ScrollToTop from './ScrollToTop';
import { getUser } from '../../nodeserverapi';
import Router from './Router';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });

    // Get token and get user info
    let token = getUserToken();
    if (!token) return;

    getUser('me', token,
      response => {
        this.props.setUserInfo(response.data);
      },
      error => {
        this.props.clearUser();
      });
  }

  render() {
    const { loaded, loading } = this.state;

    return (
      <BrowserRouter>
        <ScrollToTop>
          <div>
            {!loaded
              && (
              <div className={`load${loading ? '' : ' loaded'}`}>
                <div className="load__icon-wrap">
                  <svg className="load__icon">
                    <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                  </svg>
                </div>
              </div>
              )
            }
            <div>
              <Router />
            </div>
          </div>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(App);