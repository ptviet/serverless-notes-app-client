import React, { Component } from 'react';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
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
    this.setState({ newUser: 'test' });
    this.setState({ isLoading: false });
  };

  onConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
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
