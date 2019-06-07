import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import fetch from 'node-fetch';
import '../css/login.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Login extends Component {

    constructor(props) {
        super(props);

        this.submitLogin = this.submitLogin.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.toggleRemember = this.toggleRemember.bind(this);


        this.state = {
            email: "",
            password: "",
            validLogin: true,
            remember: false
        }

        console.log(props);
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

            console.log(data);


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
                        if (this.state.remember === true) {
                            cookies.set('uid', user._id, { maxAge: 60 * 60 * 24 * 30 });
                            cookies.set('username', user.username, { maxAge: 60 * 60 * 24 * 30 });
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

    toggleRemember(event) {
        this.setState({ remember: event.target.checked })
    }

    render() {
        return (
            <Modal show={this.props.open} onHide={this.props.closeLogin} aria-labelledby="loginModalTitle" centered>
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
                            <Form.Check type="checkbox" label="Remember me" checked={this.state.remember} onChange={(e) => this.toggleRemember(e)} />
                            <Form.Text className="text-muted">By Checking this box, you agree to allows us to store cookies in your browser.</Form.Text>
                        </Form.Group>

                        <Button type="submit">Login</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }

}

export default Login;
