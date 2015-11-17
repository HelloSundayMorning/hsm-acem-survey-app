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

var interviewerQuestion = {
        text: "Interviewer",
        key: "interviewer",
        answers: [
            {key: "nurse", text: "Nurse"},
            {key: "doctor", text: "Nurse"},
            {key: "specialist", text: "Specialist"},
        ]
    }

var genderQuestion = {
        text: "Gender:",
        key: "gender",
        answers: [
            {key: "male", text: "Male"},
            {key: "female", text: "Female"},
            {key: "other", text: "Other"},
        ]
    }


var PatientBio = React.createClass({
    getInitialState: function() {
        return {
            age: null
        }
    },
    handleChange: function(event) {
        var change = {}
        change[event.target.name] = event.target.value
        this.setState(change);
        var bio = this
        setTimeout(function() {console.log(bio.state); });
    },
    render: function() {
        return (
        <fieldset>
        <legend>Patient Information</legend>
        <label>Age: <input type="number" min="0" name="age" value={this.state.age} onChange={this.handleChange}/></label>
        <components.Question q={genderQuestion} onChange={this.handleChange} />
        <label>Gender: <input/></label>
        <label>Postcode: <input type="number" name="postcode" value={this.state.postcode} onChange={this.handleChange}/></label>
        <label>Patient email: <input type="email" name="email" value={this.state.email} onChange={this.handleChange}/></label>
        Or
        <label>Patient mobile: <input type="tel" name="phone" value={this.state.phone}  onChange={this.handleChange}/></label>
            </fieldset>
            )
    }
});

var BasicInfo = React.createClass({
    render: function() {
        return (
            <section>
            <h1>Basic Information</h1>
            <components.Question q={interviewerQuestion} />
            <PatientBio />
            </section>
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
