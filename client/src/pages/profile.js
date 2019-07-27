import React, { Component } from 'react';
import '../css/profile.css';
import ZgNav from '../components/zgNav';
import { Cookies } from 'react-cookie';
import { Button } from 'react-bootstrap';

const cookies = new Cookies();

class Profile extends Component {
    constructor(props){
        super(props);

        this.state = {
            uid: cookies.get('uid'),
            username: cookies.get('username')

        };

        this.deleteAccount = this.deleteAccount.bind(this);
    }

    componentWillMount() {
        fetch('http://localhost:8000/users/' + this.state.uid)
            .then(res => res.json())
            .then(user => this.setState({user: user}))
            .catch(err => this.setState({user: null}));
    }

    deleteAccount() {
        fetch('http://localhost:8000/users/' + this.state.uid, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
            })
            .then(res => res.json())
            .then(res => {
                cookies.remove('uid', {path: '/'});
                cookies.remove('username', {path: '/'});
                window.location.href = '/posts';
            })
            .catch(err => console.log(err));

        console.log('Account Deleted');
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

export default Profile;