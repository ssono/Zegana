import React, { Component } from 'react';
import '../css/comment.css';
import { Editor, convertFromRaw, EditorState, convertToRaw } from 'draft-js';
import { FaBookmark, FaArrowCircleUp } from 'react-icons/fa';
import MyEditor from './editor';
import { Button } from 'react-bootstrap';

function timeDiffString(created){
    const tdiff = Date.now() - created;
    console.log(created);
    if(tdiff < 1000*60){
        return '<1min';
    } else if(tdiff < 1000*60*60){
        return `${Math.floor(tdiff/(1000*60))} mins`;
    } else if(tdiff < 1000*60*60*24){
        return `${Math.floor(tdiff/(1000*60*60))} hr`;
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
            comment: this.props.comment,
            visible: this.props.visible
        }
    }

    render(){
        return (
            <div className="comment-wrap" hidden={!this.state.visible}>
                <span className="comment-header">
                    <p className="comment-author">{this.state.comment.authorName}</p>
                    <p className="comment-date">{timeDiffString(this.state.comment.dateCreated)}</p>
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
                            color="#999"
                            // onClick={this.toggleVote}
                    />
                    <p className="comment-reply">reply</p>
                    <p className="comment-comments">(0) comments</p>
                </span>
            </div>
        )
    }

}

export default Comment;