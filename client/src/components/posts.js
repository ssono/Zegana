import React, { Component } from 'react';
import '../css/posts.css';
import ZgNav from './zgNav';

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <div className="container-fluid">
                <ZgNav />
            </div>
        )
    }
}

export default Posts;