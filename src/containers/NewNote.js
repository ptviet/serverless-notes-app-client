import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { API } from 'aws-amplify';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { s3Upload } from '../libs/awsLib';
import './NewNote.css';

export default class NewNote extends Component {
  file = null;

  state = {
    isLoading: false,
    content: ''
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onFileChange = event => {
    this.file = event.target.files[0];
  };

  onSubmit = async event => {
    event.preventDefault();

    if (this.file) {
      if (this.file.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `File must be smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} Mb`
        );
        return;
      }
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file ? await s3Upload(this.file) : null;

      await this.createNote({
        attachment,
        content: this.state.content
      });
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  createNote(note) {
    return API.post('notes-app', '/notes', { body: note });
  }

  render() {
    return (
      <div className="NewNote">
        <form onSubmit={this.onSubmit}>
          <FormGroup controlId="content">
            <ControlLabel>New Note:</ControlLabel>
            <FormControl
              onChange={this.onChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.onFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Submit"
            loadingText="Submitting..."
          />
        </form>
      </div>
    );
  }
}
