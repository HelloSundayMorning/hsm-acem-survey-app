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

var AuditOne = React.createClass({
    render: function() {
        return (
            <h1>audit questionnaire 1</h1>
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

var SurveyPage = React.createClass({
    render: function() {
        var page = this.props.params.survey_page;
        console.log("Page from URL:"+page);
        var Component = routeMap[page][0];
        return (
            <div>
            <Component />
            <Footer thisPage={page} />
            </div>
            )
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

var Footer = React.createClass({
    render: function() {
        var thisPage = this.props.thisPage
        var i = pageOrder.indexOf(thisPage)
        if (i < pageOrder.length - 1) {
            var label = "Continue"
            var link = pageOrder[i+1]
        } else {
            var label = "Done"
            var link = "/"
        }

        return (
            <footer className={"page-"+thisPage}>
            <h2>progress bar @ {this.props.thisPage}</h2>
            {pageOrder.map(function(result) {
                var page = routeMap[result];
                return <span key={page}><Link className={"link-"+thisPage} to={result}>{page[1]}</Link><br /></span>
            })}
            <Link className="next-page" to={link}>{label}</Link>
            </footer>
            );
    }
});

var Survey = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <Router>
              <Route path="/" component={Intro} />
              <Route path=":survey_page" component={SurveyPage}/>
            </Router>
        )
    }
});

ReactDOM.render(<Survey />, document.getElementById('survey'));
