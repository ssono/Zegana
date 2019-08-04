import React, { Component } from 'react';
import '../css/ideaSlug.css';

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

class IdeaSlug extends Component {
    constructor(props){
        super(props);

        this.state = {
            idea: this.props.idea,
            uid: this.props.uid,
            username: this.props,
            voted: this.props.idea.voters.includes('uid')

        }

        this.navToIdea = this.navToIdea.bind(this);
    }

    navToIdea() {
        window.location.href = `/idea/${this.state.idea._id}`;
    }

    render() {
        return(
            <div className="idea-slug-wrapper" onClick={this.navToIdea}>
                <p className="idea-slug-title">{this.state.idea.title}</p>

                <p className="idea-slug-info">
                    {this.state.idea.votes} votes | submitted {timeDiffString(this.state.idea.dateCreated)} ago
                </p>

                <hr/>
            </div>
        )
    }
}

export default IdeaSlug;