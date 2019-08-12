import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './css/App.css';
import Login from './components/login';
import Signup from './components/signup';
import { Cookies } from 'react-cookie';
import topo from './images/topography.svg';

const cookies = new Cookies();



class App extends Component {

  constructor(props) {
    super(props);

    this.showSignup = this.showSignup.bind(this);
    this.closeSignup = this.closeSignup.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.closeLogin = this.closeLogin.bind(this);

    this.state = {
      signup: false,
      login: false
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

  render() {
    let uid = cookies.get('uid');
    if(uid){
      return(
        <Redirect push to="/posts/new/1" />
      )
    }
    return (
      <div className="container-fluid">

        <img src={topo} alt="topo background" className="bg"/>

        <div className="main shadow">
          <h1 id="zegana">Zegana</h1>
          <p id="subtitle">
            A community for explorers, hackers, and scholars to share their ideas.
          </p>

          <Button id="tryit" onClick={() => window.location.href = '/posts/new/1'}>Try it</Button>
          <br />
          <Button id="signup" onClick={this.showSignup}>Sign up</Button>
          <p id="login-main">Already have an account? <span id="login" onClick={this.showLogin}>Login</span></p>
        </div>

        {/* Sign Up Modal */}
        <Signup open={this.state.signup} closeSignup={this.closeSignup} showLogin={this.showLogin}/>

        <Login open={this.state.login} closeLogin={this.closeLogin} showSignup={this.showSignup}/>



      </div>
    );
  }
}

export default App;
