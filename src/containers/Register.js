import React, { Component } from 'react';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import './Register.css';
import LoaderButton from '../components/LoaderButton';

export default class Register extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newUser: null
  };

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length >= 8 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password
      });
      this.setState({ newUser });
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        try {
          await Auth.resendSignUp(this.state.email);
          this.setState({
            newUser: {
              username: this.state.email,
              password: this.state.password
            }
          });
        } catch (error) {
          if (error.message === 'User is already confirmed.') {
            this.props.history.push('/login');
          }
        }
      }
    }

    this.setState({ isLoading: false });
  };

  onConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      if (error.message === 'Incorrect username or password.') {
        alert(
          'Please login with the password you used when you signed up the first time, or sign up again with another email.'
        );
      }
      this.setState({ isLoading: false });
    }
  };

  renderConfirmationForm() {
    return (
      <form onSubmit={this.onConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.onChange}
          />
          <HelpBlock>
            Please check your email for the confirmation code.
          </HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying..."
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.onChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            onChange={this.onChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.confirmPassword}
            onChange={this.onChange}
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Submit"
          loadingText="Registering..."
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Register">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}
