import React, { Component } from 'react';
import '../css/savedIdeas.css';
import ZgNav from '../components/zgNav';
import { Cookies } from 'react-cookie';
import IdeaSlug from '../components/ideaSlug';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const cookies = new Cookies();

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sorting: this.props.match.params.sorting,
            page: this.props.match.params.page,
            uid: cookies.get('uid'),
            username: cookies.get('username')
        }

        this.navNext = this.navNext.bind(this);
        this.navPrev = this.navPrev.bind(this);
    }

    componentWillMount(){
        fetch(`http://localhost:8000/users/${this.state.uid}/saved/${this.state.sorting}/${this.state.page}`)
            .then(res => res.json())
            .then(ideas => {
                this.setState({
                    ideas: ideas,
                })
            })
            .catch(err => this.setState({ideas: undefined}));
    }

    navPrev(){
        if (this.state.page !== '1'){
            const newLoc = `/account/saved/${this.state.sorting}/${parseInt(this.state.page) - 1}`;
            window.location.href = newLoc;
        }
    }

    navNext(){
        if (this.state.ideas.length > 0){
            const newLoc = `/account/saved/${this.state.sorting}/${parseInt(this.state.page) + 1}`;
            window.location.href = newLoc;
        }
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

            if(ideas.length === 0){
                ideas.push(<p>Sorry, No more posts to view. :(</p>)
            }
            return(
                <div className="container-fluid">
                    <ZgNav />

                    <DropdownButton 
                        id="post-sort-dropdown"
                        title="Sort"
                    >
                        <Dropdown.Item href="/account/saved/new/1">New</Dropdown.Item>
                        <Dropdown.Item href="/account/saved/active/1">Active</Dropdown.Item>
                        <Dropdown.Item href="/account/saved/top/1">Top All Time</Dropdown.Item>
                    </DropdownButton>

                    {ideas}
                    <div className="page-navigation">
                        <span id="prev-button" onClick={this.navPrev} style={(this.state.page === '1')? {backgroundColor: '#999'}: {} }>Prev Page</span>
                        <span id="center-info"><p>{this.state.page}</p></span>
                        <span id="next-button" onClick={this.navNext} style={(this.state.ideas.length === 0)? {backgroundColor: '#999'}: {} }>Next Page</span>
                    </div>
                </div>
            )
        }
    }
}

export default Posts;