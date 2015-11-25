"use strict";

require('normalize.css');
require('styles/mdl.css');
require('styles/App.scss');

import React from 'react'
import * as ReactRedux from "react-redux";
import * as ReduxDev from 'redux-devtools/lib/react';
import { Router, Route, Link } from 'react-router'
import Question from 'components/Question'
import AuditPage from 'components/AuditPage'
import SurveyPage from 'components/SurveyPage'

var store = require('../stores');

var locations = store.Locations

var Intro = ReactRedux.connect(({ location }) => ({ location }), { update: store.SetLocation })(function(props) {
    return (
            <section id="intro">
            <h1>The <strong>FRAMES</strong> model</h1>

            <p><strong>F</strong>eedback: Many people are unaware that they are drinking at hazardous or harmful levels and highlighting risks linked to current drinking patterns can be a powerful motivator for change.</p>

            <p><strong>R</strong>esponsibility: Emphasise that the decision to change drinking patterns or to continue drinking at the same level is the choice of the person alone.</p>

            <p><strong>A</strong>dvice: Deliver clear advice to change drinking behaviour.</p>

            <p><strong>M</strong>enu of options: Provide a menu of strategies for changing drinking behaviours</p>

            <p><strong>E</strong>mpathy: Emphasise the development of a therapeutic alliance in the context of a warm, reflective, empathic, and collaborative approach by the practitioner.</p>

            <p><strong>S</strong>elf-efficacy: Support the person&#8217;s self-efficacy for change, and communicate a sense of optimism. De-emphasise helplessness or powerlessness.</p>

            <section id="disclaimer">
            <h2>Disclaimer (inform the Patient of this)</h2>

            <div>
            <p>This information will be used by the Australasian College for Emergency Medicine, and Hello Sunday Morning, to follow up with the patient.</p>

            <p>Information and contact details will not be shared with third parties, and all data will be pooled and de-identified if it is used for analysis.</p>
            </div>
            </section>

            <Link id="start-survey" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" to="/info">Start</Link>

            <div id="location">
            Current Location:
            <select value={props.location} onChange={event => props.update(event.target.value)}>
            {locations.map(l => <option key={l} value={l}>{l}</option> )}
        </select>
            </div>
            </section>
    );
})

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
    handleChange: function(input) {
        this.props.update(input.name, input.value)
    },
    render: function() {
        return (
                <fieldset id="patient-bio">
                <legend>Patient Information</legend>
                <label className="simple-input">Age: <input type="number" min="0" name="age" value={this.props.bio.age} onChange={(event) => this.handleChange(event.target)}/></label>
                <Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
                <label className="simple-input">Postcode: <input type="number" name="postcode" value={this.props.bio.postcode} onChange={(event) => this.handleChange(event.target)}/></label>
                <div id="contact-information">
                <label className="simple-input">Patient email: <input type="email" name="email" value={this.props.bio.email} onChange={(event) => this.handleChange(event.target)}/></label>
                Or
                <label className="simple-input">Patient mobile: <input type="tel" name="phone" value={this.props.bio.phone}  onChange={(event) => this.handleChange(event.target)}/></label>
                </div>
                </fieldset>
        )
    }
});

var PatientBio = ReactRedux.connect(function(s) { return {bio: s.bio} }, {update: store.UpdateBio})(PatientBio);

var Interviewer = ReactRedux.connect(function(s) {
    return {interviewer: s.interviewer}
}, {update: store.SetInterviewer})(function(props) {

    return (
            <Question value={props.interviewer} onChange={(input, q, a) => props.update(input.value)} q={interviewerQuestion} />
    )
})

var BasicInfo = React.createClass({
    render: function() {
        return (
                <section id="basic-info">
                <h1>Basic Information</h1>
                <Interviewer />
                <PatientBio />
                </section>
        );
    }
});

var auditQuestions = [
    {
        "text": "Q1: How often do you have a drink containing alcohol?",
        "answers": [
            {"text": "Never", score: 0},
            {"text": "Monthly or less", score: 1},
            {"text": "2-4 times a month", score: 2},
            {"text": "2-3 times a week", score: 3},
            {"text": "4 or more times a week", score: 4}]
    },{
        "text": "Q2: How many standard drinks containing alcohol do you have in a typical day?",
        "answers": [
            {"text": "1 or 2", score: 0},
            {"text": "3 or 4", score: 1},
            {"text": "5 or 6", score: 2},
            {"text": "7, 8 or 9", score: 3},
            {"text": "10 or more", score: 4}]
    },{
        "text": "Q3: How often do you have six or more drinks on one occasion?",
        "answers": [
            {"text": "Never", score: 0},
            {"text": "Monthly or less", score: 1},
            {"text": "2-4 times a month", score: 2},
            {"text": "2-3 times a week", score: 3},
            {"text": "4 or more times a week", score: 4}]
    },{
        "text": "Q4: How often during the last year have you found that you were not able to stop drinking once you had started?",
        "answers": [
            {"text": "Never"},
            {"text": "Less than monthly"},
            {"text": "Monthly"},
            {"text": "Weekly"},
            {"text": "Daily or almost daily"}]
    },{
        "text": "Q5: How often in the last year have you failed to do what was normally expected from you because of drinking?",
        "answers": [
            {"text": "Never"},
            {"text": "Less than monthly"},
            {"text": "Monthly"},
            {"text": "Weekly"},
            {"text": "Daily or almost daily"}]
    },{
        "text": "Q6: How often in the last year have you needed a first drink in the morning to get yourself going after a night of drinking?",
        "answers": [
            {"text": "Never"},
            {"text": "Less than monthly"},
            {"text": "Monthly"},
            {"text": "Weekly"},
            {"text": "Daily or almost daily"}]
    },{
        "text": "Q7: How often in the last year have you had a feeling of guilt or remorse after drinking?",
        "answers": [
            {"text": "Never"},
            {"text": "Less than monthly"},
            {"text": "Monthly"},
            {"text": "Weekly"},
            {"text": "Daily or almost daily"}]
    },{
        "text": "Q8: How often in the last year have you been unable to remember what happened the night before because you had been drinking?",
        "answers": [
            {"text": "Never"},
            {"text": "Less than monthly"},
            {"text": "Monthly"},
            {"text": "Weekly"},
            {"text": "Daily or almost daily"}]
    },{
        "text": "Q9: Have you or someone else been injured as a result of your drinking?",
        "answers": [
            {"text": "No"},
            {"text": "Yes, but not in the last year"},
            {"text": "Yes, during the last year"}]
    },{
        "text": "Q10: Has a relative or friend, or a doctor or another health worker been concerned about your drinking or suggested you cut down?",
        "answers": [
            {"text": "No"},
            {"text": "Yes, but not in the last year"},
            {"text": "Yes, during the last year"}]
    }]

var StoredSurvey = ReactRedux.connect(function(s) { return { survey: s.survey, gender: s.bio.gender } }, {update: store.Answer })

var AuditOne = StoredSurvey(React.createClass({
    render: function() {
        var start = 0;
        var end = 4;
        return (
                <AuditPage start={start} end={end} update={this.props.update} survey={this.props.survey} gender={this.props.gender} questions={auditQuestions} />
        );
    }
}));

var AuditTwo = StoredSurvey(React.createClass({
    render: function() {
        var start = 4;
        var end = 10;
        return (
                <AuditPage start={start} end={end} update={this.props.update} survey={this.props.survey} gender={this.props.gender} questions={auditQuestions} />
        );
    }
}));

var Feedback = ReactRedux.connect(null, {emailToPatient: store.EmailToPatient, emailTo: store.EmailTo })(React.createClass({
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

                <button onClick={this.props.emailToPatient}>Email to Patient</button>
                <button onClick={this.props.emailTo}>Email to…</button>
                </section>
        );
    }
}));

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
                <p>Support the person&#8217;s self-efficacy for change, and communicate a sense of optimism. De-emphasise helplessness or powerlessness.</p>
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

var s = store.NewStore()

var Survey = React.createClass({
    render: function() {
        return (
                <div>
                <ReactRedux.Provider store={s}>
                <Router>
                <Route path="/" component={Intro} />
                <Route path=":survey_page" component={SurveyPage} routeMap={routeMap} pageOrder={pageOrder}/>
                </Router>
                </ReactRedux.Provider>
                <ReduxDev.DebugPanel top right bottom>
                <ReduxDev.DevTools store={s} monitor={LogMonitor} />
                </ReduxDev.DebugPanel>
                </div>
        )
    }
});

export default Survey;
