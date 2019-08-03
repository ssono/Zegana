import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { EditorState, convertToRaw, convertFromRaw} from 'draft-js';
import '../css/editIdea.css';
import ZgNav from '../components/zgNav';
import MyEditor from '../components/editor';
import { Cookies } from 'react-cookie';


const problemPlaceholder= 'What is the problem?\nWho does it impact?';
const solutionPlaceholder= 'Describe your solution to a 5 year old\nHow does this make someone\'s life better?';
const planPlaceholder= 'What is easiest way to test this?\nWhat is the best case scenario?';
const feasibilityPlaceholder= 'What is your riskiest assumption?\nIs this the simplest way to solve the problem?';
const helpPlaceholder='What can the community do to help you?'
const cookies = new Cookies();

class EditIdea extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postId: this.props.match.params.postId,
            uid: cookies.get('uid'),
            username: cookies.get('username')
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.submitIdea = this.submitIdea.bind(this);

    }

    componentWillMount () {
        fetch(`http://localhost:8000/posts/${this.state.postId}`)
            .then(res => res.json())
            .then(post => {
                console.log(post);
                this.setState({
                    post: post,
                    title: post.title,
                    problem: EditorState.createWithContent(convertFromRaw(JSON.parse(post.problem))),
                    solution: EditorState.createWithContent(convertFromRaw(JSON.parse(post.solution))),
                    plan: EditorState.createWithContent(convertFromRaw(JSON.parse(post.plan))),
                    feasibility: EditorState.createWithContent(convertFromRaw(JSON.parse(post.feasibility))),
                    help: EditorState.createWithContent(convertFromRaw(JSON.parse(post.help))),

                })
            }).catch(err => {
                console.error(err);
            });
    }

    handleTitleChange(e){
        this.setState({title: e.target.value});
    }

    async submitIdea(e){
        e.preventDefault();
        e.stopPropagation();
        const newPost = {
            title: this.state.title,
            problem: JSON.stringify(convertToRaw(this.state.problem.getCurrentContent())),
            solution: JSON.stringify(convertToRaw(this.state.solution.getCurrentContent())),
            plan: JSON.stringify(convertToRaw(this.state.plan.getCurrentContent())),
            feasibility: JSON.stringify(convertToRaw(this.state.feasibility.getCurrentContent())),
            help: JSON.stringify(convertToRaw(this.state.help.getCurrentContent())),
            author: this.state.uid
        }

        let response = await fetch(`http://localhost:8000/posts/${this.state.postId}`, {
            method: 'PUT',
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

        if (!(this.state.post)) {
            return (
                <div className="contianer-fluid">
                    <ZgNav />
                    <h1>Loading...</h1>
                </div>
            )
        }

        return(
            <div className="container-fluid">
                <ZgNav />
                <div id="editIdea-wrapper">
                    <Form>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <p className="edit-title">{this.state.post.title}</p>
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

export default EditIdea;