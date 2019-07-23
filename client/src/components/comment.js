import React, { Component } from 'react';
import '../css/comment.css';
import { Editor, convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import { FaArrowCircleUp } from 'react-icons/fa';
import MyEditor from './editor';
import { Button } from 'react-bootstrap';

function timeDiffString(created){
    const tdiff = Date.now() - created;
    if(tdiff < 1000*60){
        return '<1min';
    } else if(tdiff < 1000*60*60){
        return `${Math.floor(tdiff/(1000*60))} mins`;
    } else if(tdiff < 1000*60*60*24){
        return `${Math.floor(tdiff/(1000*60*60))} hrs`;
    } else if(tdiff < 1000*60*60*24*30){
        return `${Math.floor(tdiff/(1000*60*60*24))} days ago`;
    } else {
        return Date(created).slice(4,15);
    }
}

class Comment extends Component {

    constructor(props) {
        super(props)

        this.state = {
            uid: this.props.uid,
            username: this.props.username,
            comment: this.props.comment,
            visible: this.props.visible,
            inputVisible: false,
            childrenVisible: false,
            replies: undefined,
            voted: this.props.comment.voters.includes(this.props.uid),
            newReply: Editor.createEmpty
        }

        this.toggleVote = this.toggleVote.bind(this);
        this.submitReply = this.submitReply.bind(this);
        this.toggleReplies = this.toggleReplies.bind(this);
        this.toggleInput = this.toggleInput.bind(this);

    }

    componentDidUpdate(prevProps){
        if(this.props.visible !== prevProps.visible){
            this.setState({visible: this.props.visible});
        }
    }

    submitReply(e) {
        e.preventDefault();
        e.stopPropagation(); 

        if(!this.state.newReply.getCurrentContent().hasText()){
            alert('Reply must have content');
            return;
        }

        const newReplyData = {
            author: this.state.uid,
            authorName: this.state.username,
            parentPost: this.state.comment.parentPost,
            parentComment: this.state.comment._id,
            content: JSON.stringify(convertToRaw(this.state.newReply.getCurrentContent()))
        }

        fetch('http://localhost:8000/comments', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReplyData)
            })
            .then(res => res.json())
            .then(reply => {

                let replies = this.state.replies || [];
                replies.push(reply);
                this.setState({
                    replies: replies,
                    inputVisible: false
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    async toggleVote(){
        if(this.state.uid !== undefined){
            this.setState({voted: !this.state.voted});
            const comment = await fetch(`http://localhost:8000/comments/${this.state.comment._id}/vote/${this.state.uid}`)
                .then(res => res.json());
            this.setState({comment: comment});
        }
    }

    toggleReplies() {
        this.setState({childrenVisible: !this.state.childrenVisible});
    }

    toggleInput(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({inputVisible: !this.state.inputVisible});
    }

    render(){

        if(this.state.replies === undefined && this.state.visible){
            fetch(`http://localhost:8000/comments/${this.state.comment._id}/replies`)
                .then(res => res.json())
                .then(replies => this.setState({replies: replies}))
        }

        let numReplies = '???';
        if(this.state.replies) {numReplies = this.state.replies.length};


        let replies = [];
        if(this.state.replies !== undefined){
            replies = this.state.replies.map(reply => {
                console.log('REPL', reply);
                return(
                    <Comment 
                        visible={this.state.childrenVisible && this.state.visible}
                        comment={reply}
                        key={reply._id}
                        uid={this.state.uid}
                        username={this.state.username}
                    />
                )
            })
        }

        return (
            <div className="comment-outer" hidden={!this.state.visible}>
                <div className="comment-wrap" onClick={this.toggleReplies}>
                    <span className="comment-header">
                        <p className="comment-author">{this.state.comment.authorName}</p>
                        <p className="comment-date">{timeDiffString(this.state.comment.dateCreated)}</p>
                        <p className="comment-votes">{this.state.comment.votes} votes</p>
                    </span>

                    <div className="comment-content-wrap">
                        <Editor
                            editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(this.state.comment.content)))}
                            readOnly={true}
                        />
                    </div>

                    <span className="comment-footer">
                        <FaArrowCircleUp 
                                className="idea-footer-section" 
                                size="1.25em" 
                                color={this.state.voted? "#00966e": "#999"}
                                onClick={this.toggleVote}
                        />
                        <p className="comment-reply" onClick={this.toggleInput}>reply</p>
                        <p className="comment-numreplies" >({numReplies}) replies</p>
                    </span>
                </div>

                <div className="comment-reply-input">
                    <div hidden={!this.state.inputVisible}>    
                        <MyEditor 
                            placeholder="Responses? Rebuttles? Reflections?"
                            editorState={this.state.newReply}
                            update={(editorState) => this.setState({newReply: editorState})}
                        />
                        <Button type="submit" onClick={this.submitReply} className="ml-auto comment-reply-submit">Reply</Button>
                    </div>
                </div>

                <div className="comment-replies">
                    {replies}
                </div>
            </div>
        )
    }

}

export default Comment;