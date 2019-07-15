import React, { Component } from 'react';
import '../css/idea.css';
import ZgNav from './zgNav';
import { Editor, convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import MyEditor from './editor';
import { Cookies } from 'react-cookie';
import { FaBookmark, FaArrowCircleUp } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const cookies = new Cookies();

class Idea extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            uid: cookies.get('uid'),
            username: cookies.get('username'),
            postId: this.props.match.params.postId,
            voted: false,
            saved: false,
            newComment: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()))
        }

        this.toggleSave = this.toggleSave.bind(this);
        this.toggleVote = this.toggleVote.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    submitComment(e){
        e.preventDefault();
        e.stopPropagation();
        const newCommentData = {
            author: this.state.uid,
            authorName: this.state.username,
            parentPost: this.state.post._id,
            content: this.state.newComment
        }
        fetch('http://localhost:8000/comments', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCommentData)
            })
            .then(res => res.json())
            .then(comment => {
                let comments = this.state.comments;
                comments.push(comment);
                this.setState({comments: comments});
            })
            .catch(err => {
                console.error(err);
            });

    }

    async toggleSave(){
        if(this.state.uid !== undefined){
            this.setState({saved: !this.state.saved});
            const post = await fetch(`http://localhost:8000/posts/${this.state.post._id}/save/${this.state.uid}`)
                .then(res => res.json());
            this.setState({post: post});
            
        }
    }

    async toggleVote(){
        if(this.state.uid !== undefined){
            this.setState({voted: !this.state.voted});
            const post = await fetch(`http://localhost:8000/posts/${this.state.post._id}/vote/${this.state.uid}`)
                .then(res => res.json());
            this.setState({post: post});
        }
    }

    componentWillMount(){
        fetch('http://localhost:8000/posts/' + this.state.postId)
            .then(res => res.json())
            .then(post => {
                this.setState({
                    post: post,
                    voted: post.voters.includes(this.state.uid),
                    saved: post.savers.includes(this.state.uid)
                })
            })
            .catch(err => this.setState({post: undefined}));

        fetch(`http://localhost:8000/posts/${this.state.postId}/comments`)
            .then(res => res.json())
            .then(comments => {
                this.setState({comments: comments});
            })
            .catch(err => this.setState({comments: undefined}));

    }

    render() {
        if(!this.state.post || !this.state.comments){
            return (
                <div className="container-fluid">
                    <ZgNav />
                    <div className="ideaWrap">
                        <h1 className="idea-title">Loading</h1>
                        
                    </div>
                </div>
            )
        } else {
            console.log(this.state);

            return (
                <div className="container-fluid">
                    <ZgNav />
                    <div className="idea-header">
                        <h1 className="idea-title">{this.state.post.title}</h1>
                        <p className="idea-subtitle">By: anon</p>
                        <p className="idea-subtitle">{Date(this.state.post.dateCreated).slice(4,15)}</p>
                        <hr/>
                    </div>
                    
                    <div className="idea-wrap">

                        <h1 className="idea-content-title">Problem</h1>
                        <div className="idea-content">
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.problem)))}
                                readOnly={true}
                            />
                        </div>

                        <h1 className="idea-content-title">Solution</h1>
                        <div className="idea-content">
                            
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.solution)))}
                                readOnly={true}
                            />
                        </div>

                        <h1 className="idea-content-title">Plan</h1>
                        <div className="idea-content">
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.plan)))}
                                readOnly={true}
                            />
                        </div>

                        <h1 className="idea-content-title">Feasibility</h1>
                        <div className="idea-content">
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.feasibility)))}
                                readOnly={true}
                            />
                        </div>

                        <h1 className="idea-content-title">How can we make this work?</h1>
                        <div className="idea-content">
                            <Editor
                                editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.post.help)))}
                                readOnly={true}
                            />
                        </div>

                    </div>

                    <div className="idea-footer">
                        <p className="idea-votes idea-footer-section">{this.state.post.votes} votes</p>
                        <FaBookmark 
                            className="idea-footer-section" 
                            size="2em" color={this.state.saved? "#00966e": "#ccc"} 
                            onClick={this.toggleSave}
                        />
                        <FaArrowCircleUp 
                            className="idea-footer-section" 
                            size="2em" color={this.state.voted? "#00966e": "#ccc"}
                            onClick={this.toggleVote}
                        />
                    </div>

                    <div className="idea-newComment">
                        <MyEditor 
                            placeholder="Questions? Comments? Concerns?"
                            editorState={this.state.newComment}
                            update={(editorState) => this.setState({newComment: editorState})}
                        />
                        <Button type="submit" onClick={this.submitComment} className="idea-comment-submit">Add Comment</Button>
                        <hr />
                    </div>
                    <p>{this.state.comments.length} Comments</p>
                </div>
                
            )

        }
    }

}

export default Idea;