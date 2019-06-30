import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/newIdea.css';
import ZgNav from './zgNav';
import Editor from './editor';

const problemPlaceholder= 'What is the problem?\nWho does it impact?';
const solutionPlaceholder= 'Describe your solution to a 5 year old\nHow does this make someone\'s life better?';
const planPlaceholder= 'What is easiest way to test this?\nWhat is the best case scenario?';
const feasibilityPlaceholder= 'What is your riskiest assumption?\nIs this the simplest way to solve the problem?';
const callPlaceholder='What can the community do to help you?'

class NewIdea extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            problem: '',
            solution: '',
            plan: '',
            feasibility: ''
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);

    }

    handleTitleChange(e){
        this.setState({title: e.target.value});
    }

    render() {
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
                            <Editor placeholder={problemPlaceholder}/>
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Solution</Form.Label>
                            <Editor placeholder={solutionPlaceholder}/>
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Plan</Form.Label>
                            <Editor placeholder={planPlaceholder}/>
                        </div>

                        <div className="Qwrap">
                            <Form.Label>Feasibility</Form.Label>
                            <Editor placeholder={feasibilityPlaceholder}/>
                        </div>

                        <div className="Qwrap">
                            <Form.Label>How do we make this work?</Form.Label>
                            <Editor placeholder={callPlaceholder}/>
                        </div>

                        <Button type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default NewIdea;