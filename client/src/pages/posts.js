import React, { Component } from 'react';
import '../css/posts.css';
import ZgNav from '../components/zgNav';
import { Cookies } from 'react-cookie';
import IdeaSlug from '../components/ideaSlug';

const cookies = new Cookies();

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uid: cookies.get('uid'),
            username: cookies.get('username')
        }
    }

    componentWillMount(){
        fetch('http://localhost:8000/posts/')
            .then(res => res.json())
            .then(ideas => {
                this.setState({
                    ideas: ideas,
                })
            })
            .catch(err => this.setState({ideas: undefined}));
    }

    render() {
        if(!this.state.ideas){
            return(
                <div className="container-fluid">
                    <ZgNav />
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            console.log(this.state.ideas);

            let ideas = [];
            ideas = this.state.ideas.map(idea => {
                return (
                    <IdeaSlug
                        uid={this.state.uid}
                        username={this.state.username}
                        idea={idea}
                        key={idea._id}
                    />
                )
            })
            return(
                <div className="container-fluid">
                    <ZgNav />
                    {ideas}
                </div>
            )
        }
    }
}

export default Posts;