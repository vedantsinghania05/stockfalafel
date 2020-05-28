import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../redux/containers/SignedInUserCtr';
import { Alert, Button } from 'reactstrap';
//import CheckBox from '../shared/components/form/CheckBox';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
//import FacebookIcon from 'mdi-react/FacebookIcon';
//import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import { signInUser, getUser } from '../nodeserverapi';

class SignIn extends Component {
  constructor() {
    super();
    this.state = { result: undefined, email: '', password: '', showPassword: false };
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  }

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  signIn = () => {
    let { email, password } = this.state;

    signInUser(email, password,
      response => {
        this.props.setUserToken(response.data.token);
        let tempUserInfo = response.data

        getUser(tempUserInfo.user.id, response.data.token,
          response => {
            this.props.setUserInfo(response.data)
          },
          error => {
          }
        )
      },
      error => {
        this.setState({ result: error.message });
      });
  }

  render() {
    const { isSignedIn } = this.props;
    const { result, email, password, showPassword } = this.state;

    if (isSignedIn) {
      return (<Redirect to={'/'} />)
    }

    return (
      <div className="account">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <h3 className="account__title">
                <span className="account__logo-main">Chatter
                  <span className='account__logo-accent'>Box</span>
                </span>    
              </h3>
              <h4 className="account__subhead subhead">Sign In</h4> 
            </div>

            <form className="form">
              {result && <Alert color="danger">{result}</Alert>}

              <div className="form__form-group">
                {/*<span className="form__form-group-label">Username</span>*/}
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountOutlineIcon />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={this.onChangeEmail}
                  />
                </div>
              </div>
              <div className="form__form-group">
                {/*<span className="form__form-group-label">Password</span>*/}
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <KeyVariantIcon />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={this.onChangePassword}
                  />
                  <button
                    className={`form__form-group-button${showPassword ? ' active' : ''}`}
                    onClick={e => this.showPassword(e)}
                    type="button"
                  ><EyeIcon />
                  </button>
                </div>
                {/* <div className="account__forgot-password">
                  <a href="/">Forgot a password?</a>
                </div> */}
              </div>
              {/*<div className="form__form-group">
                <div className="form__form-group-field">
                  <CheckBox name="remember_me" label="Remember me" value="on" onChange={() => {}} />
                </div>
              </div>*/}
              <Button className="btn btn-primary account__btn account__btn--small" onClick={this.signIn}>Submit</Button>
              <Link to="/signup">Go To Sign Up</Link>
              {/* The code below is extra scss for the link above */}
              {/* className="btn btn-outline-primary account__btn account__btn--small" */}
            </form>

            {/*<div className="account__or">
              <p>Or Easily Using</p>
            </div>
            <div className="account__social">
              <Link
                className="account__social-btn account__social-btn--facebook"
                to="/pages/one"
              >
                <FacebookIcon />
              </Link>
              <Link
                className="account__social-btn account__social-btn--google"
                to="/pages/one"
              >
                <GooglePlusIcon />
              </Link>
            </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(SignIn);

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
