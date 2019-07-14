import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import '../css/zgNav.css';
import Signup from './signup';
import Login from './login';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

class Zgnav extends Component {

    constructor(props) {
        super(props);

        this.showSignup = this.showSignup.bind(this);
        this.closeSignup = this.closeSignup.bind(this); 
        this.showLogin = this.showLogin.bind(this);
        this.closeLogin = this.closeLogin.bind(this);

        this.state = {
            signup: false,
            login: false,
            uid: cookies.get('uid'),
            username: cookies.get('username')
        }
    }

    showSignup() {
        this.setState({ signup: true });
      }
    
    closeSignup() {
      this.setState({ signup: false });
    }
    
    showLogin() {
      this.setState({ login: true });
    }
    
    closeLogin() {
      this.setState({ login: false });
    }

    logout() {
        cookies.remove('uid', {path: '/'});
        cookies.remove('username', {path: '/'});
        window.location.href = '/posts';
    }

    render() {

        let navOptions = (
            <Nav className="ml-auto" variant="pills">
                <Nav.Link id="signup" onClick={this.showSignup}>Signup</Nav.Link>
                <Nav.Link id="login" onClick={this.showLogin}>Login</Nav.Link>
                <Signup open={this.state.signup} closeSignup={this.closeSignup} />
                <Login open={this.state.login} closeLogin={this.closeLogin} />
            </Nav>
        )

        if(this.state.uid){
            navOptions = (
                <Nav className="ml-auto" variant="pills">
                    <NavDropdown title="Account" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Ideas</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Comments</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4" onClick={this.logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/newIdea">Share Idea</Nav.Link>
                    <Nav.Link href="#notif">Notifications</Nav.Link>
                    
                </Nav>
            )
        }

        return (
            <Navbar collapseOnSelect expand="lg" variant="dark" className="bg-custom">
                <Navbar.Brand href="/posts" id="zg-brand">Zegana</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {navOptions}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Zgnav;
