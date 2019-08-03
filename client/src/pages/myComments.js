import React, { Component } from 'react';
import '../css/myComments.css';
import ZgNav from '../components/zgNav';
import Comment from '../components/comment';
import { Cookies } from 'react-cookie';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const cookies = new Cookies();

class Comments extends Component {
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
        fetch(`http://localhost:8000/comments/${this.state.sorting}/${this.state.page}/${this.state.uid}`)
            .then(res => res.json())
            .then(comments => {
                this.setState({
                    comments: comments,
                })
            })
            .catch(err => this.setState({comments: undefined}));
    }

    navPrev(ev){
        if (this.state.page !== '1'){
            const newLoc = `/account/myComments/${this.state.sorting}/${parseInt(this.state.page) - 1}`;
            window.location.href = newLoc;
        }
    }

    navNext(ev){
        if (this.state.comments.length > 0){
            const newLoc = `/account/myComments/${this.state.sorting}/${parseInt(this.state.page) + 1}`;
            window.location.href = newLoc;
        }
    }

    render() {
        if(!this.state.comments){
            return(
                <div className="container-fluid">
                    <ZgNav />
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            console.log(this.state.comments);

            let comments = [];
            comments = this.state.comments.map(comment => {
                return (
                    <div className=".mycomment-comment" key={comment._id} onClick={() => window.location.href = `/idea/${comment.parentPost}`}>
                        <Comment 
                            postAuthor={this.state.uid}
                            visible={true}
                            comment={comment}
                            key={comment._id}
                            uid={this.state.uid}
                            username={this.state.username}
                        />
                    </div>
                )
            })

            if(comments.length === 0){
                comments = (<p>Sorry, No more comments to view. :(</p>);
            }

            return(
                <div className="container-fluid">
                    <ZgNav />

                    <DropdownButton 
                        id="post-sort-dropdown"
                        title="Sort"
                    >
                        <Dropdown.Item href="/account/myComments/new/1">New</Dropdown.Item>
                        <Dropdown.Item href="/account/myComments/top/1">Top All Time</Dropdown.Item>
                    </DropdownButton>

                    <div className="mycomment-wrapper">
                        {comments}
                    </div>

                    <div className="page-navigation">
                        <span id="prev-button" onClick={this.navPrev} style={(this.state.page === '1')? {backgroundColor: '#999'}: {} }>Prev Page</span>
                        <span id="center-info"><p>{this.state.page}</p></span>
                        <span id="next-button" onClick={this.navNext} style={(this.state.comments.length === 0)? {backgroundColor: '#999'}: {} }>Next Page</span>
                    </div>
                </div>
            )
        }
    }
}

export default Comments;