import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { EditorState, convertToRaw} from 'draft-js';
import '../css/newIdea.css';
import ZgNav from './zgNav';
import MyEditor from './editor';
import { Cookies } from 'react-cookie';

const problemPlaceholder= 'What is the problem?\nWho does it impact?';
const solutionPlaceholder= 'Describe your solution to a 5 year old\nHow does this make someone\'s life better?';
const planPlaceholder= 'What is easiest way to test this?\nWhat is the best case scenario?';
const feasibilityPlaceholder= 'What is your riskiest assumption?\nIs this the simplest way to solve the problem?';
const helpPlaceholder='What can the community do to help you?'
const cookies = new Cookies();

class NewIdea extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            problem: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())),
            solution: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())),
            plan: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())),
            feasibility: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())),
            help: JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())),
            uid: cookies.get('uid'),
            username: cookies.get('username')
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.submitIdea = this.submitIdea.bind(this);

    }

    handleTitleChange(e){
        this.setState({title: e.target.value});
    }

    async submitIdea(e){
        e.preventDefault();
        e.stopPropagation();
        const newPost = {
            title: this.state.title,
            problem: this.state.problem,
            solution: this.state.solution,
            plan: this.state.plan,
            feasibility: this.state.feasibility,
            help: this.state.help,
            author: this.state.uid
        }

        let response = await fetch('http://localhost:8000/posts', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
            .then(res => res.json())
            .catch(err => alert(err))
        
        window.location.href = '/idea/'+ String(response._id);
    }

    render() {
        if(!(this.state.uid)){
            window.location.href = '/';
        }
        return(
            <div className="container-fluid">
                <ZgNav />
                <div id="newIdea-wrapper">
                    <Form>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                placeholder="Give your Idea a Title"
                                value={this.state.title}
                                onChange={(e) => this.handleTitleChange(e)}
                            />
                        </Form.Group>


                        <div className="Qwrap">
                            <Form.Label>Problem</Form.Label>
                            <MyEditor 
                                placeholder={problemPlaceholder} 
                                editorState={this.state.problem}
                                update={(editorState) => this.setState({problem: editorState})}
                            />
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Solution</Form.Label>
                            <MyEditor 
                                placeholder={solutionPlaceholder} 
                                editorState={this.state.solution}
                                update={(editorState) => this.setState({solution: editorState})}
                            />
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Plan</Form.Label>
                            <MyEditor 
                                placeholder={planPlaceholder} 
                                editorState={this.state.plan}
                                update={(editorState) => this.setState({plan: editorState})}
                            />
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Feasibility</Form.Label>
                            <MyEditor 
                                placeholder={feasibilityPlaceholder} 
                                editorState={this.state.feasibility}
                                update={(editorState) => this.setState({feasibility: editorState})}
                            />
                        </div>

                        <div className="Qwrap">
                            <Form.Label>How do we make this work?</Form.Label>
                            <MyEditor 
                                placeholder={helpPlaceholder} 
                                editorState={this.state.help}
                                update={(editorState) => this.setState({help: editorState})}
                            />
                        </div>

                        <Button type="submit" onClick={this.submitIdea}>Submit</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default NewIdea;