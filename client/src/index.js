import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import Frontpage from './components/frontpage';
import NewIdea from './components/newIdea';
import * as serviceWorker from './serviceWorker';


const routing = (
  <Router>
    <Route exact path="/" component={App}/>
    <Route exact path="/frontpage" component={Frontpage}/>
    <Route exact path="/newIdea" component={NewIdea}/>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
