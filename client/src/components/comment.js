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
        return `${Math.floor(tdiff/(1000*60*60*24))} days`;
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
            postAuthor: this.props.postAuthor,
            comment: this.props.comment,
            visible: this.props.visible,
            inputVisible: false,
            editVisible: false,
            childrenVisible: false,
            replies: undefined,
            voted: this.props.comment.voters.includes(this.props.uid),
            newReply: EditorState.createEmpty(),
            editedComment: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.comment.content))),
            deleted: this.props.comment.deleted
        }

        this.toggleVote = this.toggleVote.bind(this);
        this.submitReply = this.submitReply.bind(this);
        this.toggleReplies = this.toggleReplies.bind(this);
        this.toggleInput = this.toggleInput.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.deleteComment = this.deleteComment.bind(this);

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

    submitEdit(e) {
        e.preventDefault();
        e.stopPropagation();

        const newEditData = {
            content: JSON.stringify(convertToRaw(this.state.editedComment.getCurrentContent()))
        }

        fetch(`http://localhost:8000/comments/${this.state.comment._id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEditData)
            })
            .then(res => res.json())
            .then(comment => {

                this.setState({
                    comment: comment,
                    editVisible: false,
                    editedComment: EditorState.createWithContent(convertFromRaw(JSON.parse(comment.content)))

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
        this.setState({inputVisible: !this.state.inputVisible, editVisible: false});
    }

    toggleEdit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({editVisible: !this.state.editVisible, inputVisible: false});
    }

    deleteComment(e) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({deleted: true});

        fetch(`http://localhost:8000/comments/${this.state.comment._id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({deleted: true})
            })
            .then(res => res.json())
            .then(comment => {

                this.setState({
                    comment: comment
                });
            })
            .catch(err => {
                console.error(err);
            });

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
                return(
                    <Comment 
                        postAuthor={this.state.postAuthor}
                        visible={this.state.childrenVisible && this.state.visible}
                        comment={reply}
                        key={reply._id}
                        uid={this.state.uid}
                        username={this.state.username}
                    />
                )
            })
        }

        const editButtons = ( 
            <span id="comment-edit-owner">
                <p className="comment-subfooter" onClick={this.toggleEdit}>edit</p>
                <p className="comment-subfooter" onClick={this.deleteComment}>delete</p> 
            </span>
        );

        if (!this.state.deleted) {
            return (
                <div className="comment-outer" hidden={!this.state.visible}>
                    <div className="comment-wrap" onClick={this.toggleReplies}>
                        <span className="comment-header">
                            <p className="comment-author">{this.state.comment.author === this.state.postAuthor ? 'OP' : this.state.comment.authorName}</p>
                            <p className="comment-date">submitted {timeDiffString(this.state.comment.dateCreated)} ago</p>
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
                            <p className="comment-subfooter" id="comment-reply" onClick={this.toggleInput}>reply</p>
                            <p className="comment-subfooter" id="comment-numreplies" >({numReplies}) replies</p>
                            {(this.state.uid === this.state.comment.author) && editButtons}                        
                        </span>
                    </div>

                    <div className="comment-edit-input">
                        <div hidden={!this.state.editVisible}>    
                            <MyEditor 
                                editorState={this.state.editedComment}
                                update={(editorState) => this.setState({editedComment: editorState})}
                            />
                            <Button type="submit" onClick={this.submitEdit} className="ml-auto comment-reply-submit">Edit</Button>
                        </div>
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
        } else {
            return (
                <div className="comment-outer" hidden={!this.state.visible}>
                    <div className="comment-wrap" onClick={this.toggleReplies}>
                        <span className="comment-header">
                            <p className="comment-author">[deleted]</p>
                            <p className="comment-date">submitted {timeDiffString(this.state.comment.dateCreated)} ago</p>
                            <p className="comment-votes">{this.state.comment.votes} votes</p>
                        </span>

                        <div className="comment-content-wrap">
                            <p>[deleted]</p>
                        </div>

                        <span className="comment-footer">
                            <p className="comment-subfooter" id="comment-numreplies" >({numReplies}) replies</p>                      
                        </span>
                    </div>


                    <div className="comment-replies">
                        {replies}
                    </div>
                </div>
            )
        }
    }

}

export default Comment;