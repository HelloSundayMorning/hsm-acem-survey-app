"use strict";

// main.js
// FIXME make this work with an ES6 transpiler
// import { Router, Route, Link } from 'react-router'
// import { React } from 'react'
// import { ReactDOM } from 'react-dom"

var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var components = require('./components.jsx');

var Intro = React.createClass({
    render: function() {
        return (
            <section>
            <h1>intro</h1>
            <Link to="/info">Start</Link>
            </section>
            );
    }
});

var BasicInfo = React.createClass({
    render: function() {
        return (
            <h1>info</h1>
            );
    }
});

var auditOneQuestions = [
    {
        text: "Q1: How often do you have a drink containing alcohol?",
        key: "q1",
        answers: [
            {key: "never", text: "Never"},
            {key: "monthly", text: "2-4 times a month"},
        ]
    }
]

var AuditOne = React.createClass({
    render: function() {
        return (
            <section>
              <h1>audit questionnaire 1</h1>
              {auditOneQuestions.map(function(q) {
                return <components.Question key={q.key} q={q} />
              })}
            </section>
        );
    }
});

var AuditTwo = React.createClass({
    render: function() {
        return (
            <h1>audit questionnaire 2</h1>
            );
    }
});

var Feedback = React.createClass({
    render: function() {
        return (
            <h1>feedback</h1>
            );
    }
});

var Frames = React.createClass({
    render: function() {
        return (
            <h1>frames reminder</h1>
            );
    }
});

var routeMap = {
    "/": [Intro, "Start"],
    "info": [BasicInfo, "Basic Info"],
    "audit1": [AuditOne, "AUDIT 1"],
    "audit2": [AuditTwo, "AUDIT 2"],
    "feedback": [Feedback, "Feedback"],
    "frames": [Frames, "FRAMES"]
}

var pageOrder = ["/", "info", "audit1", "audit2", "feedback", "frames"]

var Survey = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <Router>
              <Route path="/" component={Intro} />
              <Route path=":survey_page" component={components.SurveyPage} routeMap={routeMap} pageOrder={pageOrder}/>
            </Router>
        )
    }
});

ReactDOM.render(<Survey />, document.getElementById('survey'));
