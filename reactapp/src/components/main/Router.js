import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signedInUserMstp, signedInUserMdtp } from '../../redux/containers/SignedInUserCtr';
import Layout from './layout/index';
import MainWrapper from './MainWrapper';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import Users from '../Users'
import Home from '../Home';
import SignOut from '../SignOut';
import Admin from '../Admin'

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route {...rest} render={props => (
    authenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }} />
    )
  )} />
);

const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/admin" component={Admin} />
        <Route exact path="/signout" component={SignOut} />
        <Route exact path="/users" component={Users} />
      </Switch>
    </div>
  </div>
);

class Router extends Component {
  render() {
    return (
      <MainWrapper>
        <main>
          <Switch>
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <PrivateRoute authenticated={this.props.isSignedIn} component={wrappedRoutes} />
          </Switch>
        </main>
      </MainWrapper>      
    );
  }
}

export default connect(signedInUserMstp, signedInUserMdtp)(Router);