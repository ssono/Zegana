import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import fetch from 'node-fetch';
import './App.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class App extends Component {

  constructor(props) {
    super(props);

    this.showSignup = this.showSignup.bind(this);
    this.closeSignup = this.closeSignup.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.toggleRemember = this.toggleRemember.bind(this);

    this.state = {
      signup: false,
      login: false,
      email: "",
      password: "",
      username: "",
      availableEmail: true,
      availableUsername: true,
      validLogin: true,
      remember: false
    }
  }

  showSignup() {
    this.setState({ signup: true });
  }

  closeSignup() {
    this.setState({
      signup: false,
      login: false,
      email: "",
      password: "",
      username: "",
      availableEmail: true,
      availableUsername: true,
      validLogin: true,
      remember: false
    });
  }

  showLogin() {
    this.setState({ login: true });
  }

  closeLogin() {
    this.setState({
      signup: false,
      login: false,
      email: "",
      password: "",
      username: "",
      availableEmail: true,
      availableUsername: true,
      validLogin: true,
      remember: false
    });
  }

  submitSignup(event) {
    const form = event.currentTarget;
    console.log(cookies.get('uid'));
    console.log(cookies.get('username'));
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();

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
            cookies.set('uid', user._id);
            cookies.set('username', user.username);

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

  submitLogin(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();

      let data = {
        email: this.state.email,
        password: this.state.password
      }
      

      fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(async res => {

          if (res.status === 200) {
            let user = await res.json()            
            .catch(err => {
              console.log(err);
            })
            if(this.state.remember === true){
              cookies.set('uid', user._id, {maxAge: 60*60*24*30});
              cookies.set('username', user.username, {maxAge: 60*60*24*30});
            } else {
              cookies.set('uid', user._id);
              cookies.set('username', user.username);
            }

            console.log(user);

          } else if (res.status === 404 || res.status === 401) {
            this.setState({
              validLogin: false
            });
            console.log(this.state);
          }

        })
        .catch(err => {
          console.log(err);
          alert(err);
        });
    }
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

  toggleRemember(event) {
    this.setState({remember: event.target.checked})
  }

  render() {
    return (
      <div className="container-fluid">

        <div className="main shadow">
          <h1 id="zegana">Zegana</h1>
          <p id="subtitle">
            A community for explorers, hackers, and scholars to share their ideas.
          </p>

          <Button id="signup" onClick={this.showSignup}>Signup</Button>
          <br />
          <Button id="login" onClick={this.showLogin}>Login</Button>
        </div>

        {/* Sign Up Modal */}
        <Modal show={this.state.signup} onHide={this.closeSignup} aria-labelledby="signupModalTitle" centered>
          <Modal.Header closeButton>
            <Modal.Title id="signupModalTitle">Sign up</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form  onSubmit={(e) => this.submitSignup(e)}>
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
          </Modal.Body>
        </Modal>

        {/* Login Modal */}
        <Modal show={this.state.login} onHide={this.closeLogin} aria-labelledby="loginModalTitle" centered>
          <Modal.Header closeButton>
            <Modal.Title id="loginModalTitle">
              Login
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={(e) => this.submitLogin(e)}>
              <Form.Group controlId="loginEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email"
                  placeholder="Your Email"
                  required
                  value={this.state.email}
                  onChange={(e) => this.changeEmail(e)}
                />
              </Form.Group>

              <Form.Group controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"
                  placeholder="Your Password"
                  required
                  value={this.state.password}
                  onChange={(e) => this.changePassword(e)}
                />
              </Form.Group>

              {!this.state.validLogin &&
                <p className="invalidField">Invalid email or password</p>
              }

              <Form.Group controlId="LoginRemember">
                <Form.Check type="checkbox" label="Remember me" checked={this.state.remember} onChange={(e) => this.toggleRemember(e)}/>
                <Form.Text className="text-muted">By Checking this box, you agree to allows us to store cookies in your browser.</Form.Text>
              </Form.Group>

              <Button type="submit">Login</Button>
            </Form>
          </Modal.Body>
        </Modal>

      </div>
    );
  }
}

export default App;
