import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import './App.css';
import Routes from './Routes';
import AppNavbar from './AppNavbar';

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true
  };

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
    this.setState({
      isAuthenticating: false
    });
  }

  userHasAuthenticated = authenticated => {
    this.setState({
      isAuthenticated: authenticated
    });
  };

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push('/login');
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          <AppNavbar
            handleLogout={this.handleLogout}
            isAuthenticated={this.state.isAuthenticated}
          />
          <Routes childProps={childProps} />
        </div>
      )
    );
  }
}

export default withRouter(App);
