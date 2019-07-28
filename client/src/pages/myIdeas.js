import React, { Component } from 'react';
import '../css/myIdeas.css';
import ZgNav from '../components/zgNav';
import { Cookies } from 'react-cookie';
import { Button } from 'react-bootstrap';

const cookies = new Cookies();

class MyIdeas extends Component {
    constructor(props){
        super(props);

        this.state = {
            uid: cookies.get('uid'),
            username: cookies.get('username'),
            sorting: this.props.match.params.sorting

        };

    }

    componentWillMount() {
        fetch('http://localhost:8000/users/' + this.state.uid)
            .then(res => res.json())
            .then(user => this.setState({user: user}))
            .catch(err => this.setState({user: null}));
    }


    render() {
        console.log(this.state);
        if(!this.state.user){
            return (
                <div className='container-fluid'>
                    <ZgNav />
                    <h1>Loading</h1>
                </div>
            )
        }
        return(
            <div className='container-fluid'>
                <ZgNav />
                <div className='profile-main'>
                    <h1 className="profile-title">Basic Info</h1>
                    <hr/>

                    <p><span className='profile-stat-label'>username:</span> {this.state.user.username}</p>
                    <p><span className='profile-stat-label'>email:</span> {this.state.user.email}</p>
                    <p><span className='profile-stat-label'>joined:</span> {Date(this.state.user.joined).slice(4,15).replace(/ /g, ', ')}</p>
                    <p><span className='profile-stat-label'>votes:</span> {this.state.user.votes}</p>

                    <h1 className="profile-title">Settings</h1>
                    <hr/>
                    <Button className='profile-delete btn-custom ml-auto' onClick={this.deleteAccount}>Delete Account</Button>
                </div>
            </div>
        )
    }

}

export default MyIdeas;