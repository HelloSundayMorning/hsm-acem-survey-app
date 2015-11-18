"use strict";

// main.js
// FIXME make this work with an ES6 transpiler
// import { Router, Route, Link } from 'react-router'
// import { React } from 'react'
// import { ReactDOM } from 'react-dom"

var React = require('react');
var ReactDOM = require('react-dom');

var ReactRedux = require("react-redux");
var ReduxDev = require("redux-devtools/lib/react");

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var components = require('./components.jsx');
var store = require('./store.js');

var Intro = React.createClass({
    render: function() {
        return (
            <section>
            <h1>The <strong>FRAMES</strong> model</h1>

            <p><strong>F</strong>eedback: Many people are unaware that they are drinking at hazardous or harmful levels and highlighting risks linked to current drinking patterns can be a powerful motivator for change.</p>

            <p><strong>R</strong>esponsibility: Emphasise that the decision to change drinking patterns or to continue drinking at the same level is the choice of the person alone.</p>

            <p><strong>A</strong>dvice: Deliver clear advice to change drinking behaviour.</p>

            <p><strong>M</strong>enu of options: Provide a menu of strategies for changing drinking behaviours</p>

            <p><strong>E</strong>mpathy: Emphasise the development of a therapeutic alliance in the context of a warm, reflective, empathic, and collaborative approach by the practitioner.</p>

            <p><strong>S</strong>elf-efficacy: Support the person's self-efficacy for change, and communicate a sense of optimism. De-emphasise helplessness or powerlessness.</p>

<h2>Disclaimer (inform the Patient of this)</h2>

<p>This information will be used by the Australasian College for Emergency Medicine, and Hello Sunday Morning, to follow up with the patient.</p>

<p>Information and contact details will not be shared with third parties, and all data will be pooled and de-identified if it is used for analysis.</p>

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
            {key: "doctor", text: "Doctor"},
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
    handleChange: function(event) {
        var input = event.target
        this.props.update(input.name, input.value)
        console.log(store.Store.getState())
    },
    render: function() {
        return (
        <fieldset>
        <legend>Patient Information</legend>
        <label>Age: <input type="number" min="0" name="age" value={this.props.bio.age} onChange={this.handleChange}/></label>
        <components.Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
        <label>Postcode: <input type="number" name="postcode" value={this.props.bio.postcode} onChange={this.handleChange}/></label>
        <label>Patient email: <input type="email" name="email" value={this.props.bio.email} onChange={this.handleChange}/></label>
        Or
        <label>Patient mobile: <input type="tel" name="phone" value={this.props.bio.phone}  onChange={this.handleChange}/></label>
            </fieldset>
            )
    }
});

var PatientBio = ReactRedux.connect(function(s) { return {bio: s.bio} }, {update: store.UpdateBio})(PatientBio);

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

var StoredSurvey = ReactRedux.connect(function(s) { return {survey: s.survey} }, {update: store.Answer })


var auditOneQuestions = [{"text": "Q1: How often do you have a drink containing alcohol?",
  "answers": [
    {"text": "Never"},
    {"text": "Monthly or less"},
    {"text": "2-4 times a month"},
    {"text": "2-3 times a week"},
    {"text": "4 or more times a week"}
  ]},

 {"text": "Q2: How many standard drinks containing alcohol do you have in a typical day?",
  "answers": [
    {"text": "1 or 2"},
    {"text": "3 or 4"},
    {"text": "5 or 6"},
    {"text": "7, 8 or 9"},
    {"text": "10 or more"}
  ]},
 {"text": "Q3: How often do you have six or more drinks on one occasion?",
  "answers": [
    {"text": "Never"},
    {"text": "Monthly or less"},
    {"text": "2-4 times a month"},
    {"text": "2-3 times a week"},
    {"text": "4 or more times a week"}
  ]},
 {"text": "Q4: How often during the last year have you found that you were not able to stop drinking once you had started?",
  "answers": [
    {"text": "Never"},
    {"text": "Less than monthly"},
    {"text": "Monthly"},
    {"text": "Weekly"},
    {"text": "Daily or almost daily"}
  ]}]

var AuditOne = StoredSurvey(React.createClass({
    render: function() {
        var update = this.props.update;
        var change = function(event) {
            var input = event.target
            update(1, input.name, input.value)
        console.log(store.Store.getState())
        }
        return (
            <section>
              <h1>Audit Questionnaire</h1>
              {auditOneQuestions.map(function(q) {
                return <components.Question key={q.key || q.text} q={q} onChange={change} />
              })}
            </section>
        );
    }
}));

var auditTwoQuestions = [{"text": "Q5: How often in the last year have you failed to do what was normally expected from you because of drinking?",
  "answers": [
    {"text": "Never"},
    {"text": "Less than monthly"},
    {"text": "Monthly"},
    {"text": "Weekly"},
    {"text": "Daily or almost daily"}
  ]},
 {"text": "Q6: How often in the last year have you needed a first drink in the morning to get yourself going after a night of drinking?",
  "answers": [
    {"text": "Never"},
    {"text": "Less than monthly"},
    {"text": "Monthly"},
    {"text": "Weekly"},
    {"text": "Daily or almost daily"}
  ]},
 {"text": "Q7: How often in the last year have you had a feeling of guilt or remorse after drinking?",
  "answers": [
    {"text": "Never"},
    {"text": "Less than monthly"},
    {"text": "Monthly"},
    {"text": "Weekly"},
    {"text": "Daily or almost daily"}
  ]},
 {"text": "Q8: How often in the last year have you been unable to remember what happened the night before because you had been drinking?",
  "answers": [
    {"text": "Never"},
    {"text": "Less than monthly"},
    {"text": "Monthly"},
    {"text": "Weekly"},
    {"text": "Daily or almost daily"}
  ]},
 {"text": "Q9: Have you or someone else been injured as a result of your drinking?",
  "answers": [
    {"text": "No"},
    {"text": "Yes, but not in the last year"},
    {"text": "Yes, during the last year"}
  ]},
 {"text": "Q10: Has a relative or friend, or a doctor or another health worker been concerned about your drinking or suggested you cut down?",
  "answers": [
    {"text": "No"},
    {"text": "Yes, but not in the last year"},
    {"text": "Yes, during the last year"}
  ]}]

var AuditTwo = StoredSurvey(React.createClass({
    render: function() {
        return (
            <section>
              <h1>Audit Questionnaire</h1>
              {auditTwoQuestions.map(function(q) {
                return <components.Question key={q.key || q.text} q={q} onChange={change}  />
              })}
            </section>
            );
    }
}));

var Feedback = React.createClass({
    render: function() {
        return (
<section>
            <h1>Feedback</h1>

<p>Looking at this information, how do you feel about your level of drinking?</p>

<p>Only you can make the decision to change your consumption. Here are some strategies you can try if you want to cut back:</p>

<ul>
<li>Setting personal drinking limits and sticking to it;</li>
<li>Alternating alcoholic drinks with soft drinks;</li>
<li>Switching to low alcohol drinks;</li>
<li>Having regular alcohol-free days;</li>
<li>Identifying high risk situations for heavy drinking and creating a management plan;</li>
<li>Engaging in alternative activities to drinking</li>
</ul>
</section>
            );
    }
});

var Frames = React.createClass({
    render: function() {
        return (
<section>
            <h1>FRAMES reminder</h1>

<h2>Feedback</h2>
<p>Show the previous screen to the patient. Many people are unaware that they are drinking at hazardous or harmful levels and highlighting risks linked to current drinking patterns can be a powerful motivator for change.</p>

<p>“You’ve scored 16 on the AUDIT which indicates that you are at high risk of harm from your current pattern of drinking…”</p>

<h2>Responsibility</h2>
<p>Emphasise that the decision to change drinking patterns or to continue drinking at the same level is the choice of the person alone.</p>
<p>“Nobody can make this choice for you. It’s really up to you to make a change…”</p>

<h2>Advice</h2>
<p>Deliver clear advice to change drinking behaviour.</p>
<p>“…yet as your (doctor, pharmacist, health care worker) I strongly advise you to limit your drinking or stop altogether to reduce the risks.”</p>

<h2>Provide a menu of strategies for changing drinking behaviours.</h2>
<p>Examples:</p>

<ul>
<li>Setting personal drinking limits and sticking to it;</li>
<li>Alternating alcoholic drinks with soft drinks;</li>
<li>Switching to low alcohol drinks;</li>
<li>Having regular alcohol-free days;</li>
<li>Identifying high risk situations for heavy drinking and creating a management plan; Engaging in alternative activities to drinking.</li>
</ul>

<h2>Empathy</h2>
<p>Emphasise the development of a therapeutic alliance in the context of a warm, reflective, empathic, and collaborative approach by the practitioner.</p>

<h2>Self-efficacy</h2>
<p>Support the person's self-efficacy for change, and communicate a sense of optimism. De-emphasise helplessness or powerlessness.</p>
            <p>“Many people successfully control their drinking or stop drinking all together. With the right support and information I’m confident that you will do it too”.</p>
            </section>
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


var LogMonitor = ReduxDev.LogMonitor

var s = store.Store

var Survey = React.createClass({
    render: function() {
        return (
            <div>
            <ReactRedux.Provider store={s}>
            <Router>
            <Route path="/" component={Intro} />
            <Route path=":survey_page" component={components.SurveyPage} routeMap={routeMap} pageOrder={pageOrder}/>
            </Router>
            </ReactRedux.Provider>
            <ReduxDev.DebugPanel top right bottom>
              <ReduxDev.DevTools store={s} monitor={LogMonitor} />
            </ReduxDev.DebugPanel>
            </div>
        )
    }
});

ReactDOM.render(<Survey />, document.getElementById('survey'));
