import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import fetch from 'node-fetch';
import '../css/signup.css';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

class Signup extends Component {

  constructor(props) {
    super(props);

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
    this.openLogin = this.openLogin.bind(this);


    this.state = {
      email: "",
      password: "",
      username: "",
      availableEmail: true,
      availableUsername: true
    }

  }

  openLogin() {
    this.props.closeSignup();
    this.props.showLogin();
  }


  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  changeUsername(event) {
    this.setState({ username: event.target.value });
  }

  submitSignup(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();

      if(this.state.username === 'OP'){
        return this.setState({
          availableUsername: false
        })
      }

      let data = {
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      }

      fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(async res => {
          let json = await res.json();
          if (res.status === 201) {
            let user = json;
            cookies.set('uid', user._id, {path: '/'});
            cookies.set('username', user.username, {path: '/'});
            window.location.href= '/posts/new/1';

          } else if (res.status === 409) {
            this.setState({
              availableEmail: json.email,
              availableUsername: json.username
            });
          }
        })
        .catch(err => {
          console.log(err);
          alert(err);
        });
    }
  }

  render() {

    return (
      <Modal show={this.props.open} onHide={this.props.closeSignup} aria-labelledby="signupModalTitle" centered>
        <Modal.Header closeButton>
          <Modal.Title id="signupModalTitle">Sign up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={(e) => this.submitSignup(e)}>
            <Form.Group controlId="signupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Your Email"
                value={this.state.email}
                onChange={(e) => this.changeEmail(e)}
              />
              {!this.state.availableEmail &&
                <p className="invalidField">That email already has an account.</p>
              }
            </Form.Group>

            <Form.Group controlId="signupUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Your Username"
                required
                value={this.state.username}
                onChange={(e) => this.changeUsername(e)}
              />
              {!this.state.availableUsername &&
                <p className="invalidField">This username is taken</p>
              }
            </Form.Group>

            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"
                placeholder="Your password"
                required
                value={this.state.password}
                onChange={(e) => this.changePassword(e)}
              />
            </Form.Group>

            <Form.Group controlId="signupTOC">
              <Form.Check type="checkbox" label="Terms and Conditions" required />
              <Form.Text className="text-muted" inline="true">By checking this box, you agree to the terms, conditions, and privacy policy</Form.Text>
            </Form.Group>

            <Button type="submit">Sign Up</Button>

          </Form>
          <p id="login-main">Already have an account? <span id="login-switch" onClick={this.openLogin}>Login</span></p>
        </Modal.Body>
      </Modal>
    )
  }

}

export default Signup;
