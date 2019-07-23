import React, { Component } from 'react';
import '../css/posts.css';
import ZgNav from '../components/zgNav';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

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