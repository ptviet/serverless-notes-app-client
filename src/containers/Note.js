import React, { Component } from 'react';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { s3Upload, s3Delete } from '../libs/awsLib';
import './Note.css';

export default class Note extends Component {
  file = null;
  originalFilename = null;

  state = {
    note: null,
    content: '',
    attachmentURL: null,
    isLoading: null,
    isDeleting: null
  };

  async componentDidMount() {
    try {
      let attachmentURL;
      const note = await this.getNote();
      const { content, attachment } = note;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
        this.originalFilename = attachment;
      }

      this.setState({
        note,
        content,
        attachmentURL
      });
    } catch (error) {
      console.log(error);
    }
  }

  getNote() {
    return API.get('notes-app', `/notes/${this.props.match.params.id}`);
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

  formateFileName(name) {
    return name.replace(/^\w+-/, '');
  }

  saveNote(note) {
    return API.put('notes-app', `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }

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

    let attachment;

    try {
      if (this.file) {
        attachment = await s3Upload(this.file);
        if (this.originalFilename) {
          await s3Delete(this.originalFilename);
        }
      }

      await this.saveNote({
        content: this.state.content,
        attachment: attachment || this.state.note.attachment || null
      });
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  deleteNote() {
    return API.del('notes-app', `/notes/${this.props.match.params.id}`);
  }

  onDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
    try {
      await this.deleteNote();
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      this.setState({ isDeleting: false });
    }
  };

  render() {
    return (
      <div className="Note">
        {this.state.note && (
          <form onSubmit={this.onSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.onChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.attachment && (
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_black"
                    rel="noopener noreferer"
                    href={this.state.attachmentURL}
                  >
                    {this.formateFileName(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            )}
            <FormGroup controlId="file">
              {!this.state.note.attachment && (
                <ControlLabel>Attachment</ControlLabel>
              )}
              <FormControl onChange={this.onFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving..."
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.onDelete}
              text="Delete"
              loadingText="Deleting..."
            />
          </form>
        )}
      </div>
    );
  }
}
