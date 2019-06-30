import React, { Component } from 'react';
import '../css/frontpage.css';
import ZgNav from './zgNav';

class Frontpage extends Component {
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

export default Frontpage;