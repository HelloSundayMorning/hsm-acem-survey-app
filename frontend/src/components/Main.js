require('normalize.css');
require('styles/mdl.css');
require('styles/App.scss');

import React from 'react'
import * as ReactRedux from 'react-redux';
import { Router, Route, Link } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import Question from 'components/Question'
import AuditPage from 'components/AuditPage'
import SurveyPage from 'components/SurveyPage'
import Feedback from 'components/Feedback'
import history from 'actions/history'
import * as email from 'actions/email'
import { surveyScore, dailyScore } from 'src/surveyResults'
import * as config from 'config'
import logo from 'src/images/ACEM_V1_CMYK.png' // @_@
import installPolyfills from 'src/polyfills'

installPolyfills()

var store = require('../stores');

const LOCATION_KEY = 'location'

const Locations = ['Warrnambool', 'Clayton', 'Fitzroy', 'Geelong'];

function initialiseLocation(s, locations, action) {
    const storage = window.localStorage
    let location = storage.getItem(LOCATION_KEY)
    if (!location || locations.indexOf(location) === -1) {
        location = locations[0]
    }
    storage.setItem(LOCATION_KEY, location)
    s.dispatch(action(location))
}

function updateLocation(location, cb) {
    window.localStorage.setItem(LOCATION_KEY, location)
    cb(location)
}

import * as bio from 'actions/bio'

function Header() {
    return (
            <header>
            Alcohol Screener
            <img src={logo} />
            </header>
    )
}

var Intro = ReactRedux.connect(({ location }) => ({ location }), { update: bio.location.action })(function(props) {
    return (
        <div className='survey-page'>
            <section id='intro'>
            <h1>The FRAMES model</h1>

            <p><strong>F</strong>eedback: Many people are unaware that they are drinking at hazardous or harmful levels and highlighting risks linked to current drinking patterns can be a powerful motivator for change.</p>

            <p><strong>R</strong>esponsibility: Emphasise that the decision to change drinking patterns or to continue drinking at the same level is the choice of the person alone.</p>

            <p><strong>A</strong>dvice: Deliver clear advice to change drinking behaviour.</p>

            <p><strong>M</strong>enu of options: Provide a menu of strategies for changing drinking behaviours</p>

            <p><strong>E</strong>mpathy: Emphasise the development of a therapeutic alliance in the context of a warm, reflective, empathic, and collaborative approach by the practitioner.</p>

            <p><strong>S</strong>elf-efficacy: Support the person&#8217;s self-efficacy for change, and communicate a sense of optimism. De-emphasise helplessness or powerlessness.</p>

            <section id='disclaimer' className='instructions'>
            <h2>Disclaimer - Please tell your patient:</h2>

            <blockquote>
            <p>I would like to ask you a few questions about your alcohol use. The information will be used by the Australasian College for Emergency Medicine in partnership with Hello Sunday Morning. Your information and contact details will not be shared with third parties, and all data will be de-identified for analysis.</p>
            </blockquote>
            </section>
            </section>

        <footer>

            <div id='location'>
            Current Location:
            <select value={props.location} onChange={({target: {value}}) => updateLocation(value, props.update)}>
            {Locations.map(l => <option key={l} value={l}>{l}</option> )}
        </select>
            </div>

            <Link id='start-survey' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' to='/info'>Start</Link>

        </footer>
            </div>
    );
})

var interviewerQuestion = {
    text: 'Interviewer',
    key: 'interviewer',
    answers: [
        {key: 'nurse', text: 'Nurse'},
        {key: 'doctor', text: 'Doctor'},
        {key: 'specialist', text: 'Specialist'}
    ]
}

var genderQuestion = {
    text: 'Gender:',
    key: 'gender',
    answers: [
        {key: 'male', text: 'Male'},
        {key: 'female', text: 'Female'},
        {key: 'other', text: 'Other'}
    ]
}

var PatientBio = React.createClass({
    handleChange: function(input) {
        this.props.update(input.value, input.name)
    },
    render: function() {
        return (
                <fieldset id='patient-bio'>
                <legend>Patient Information</legend>
                <label className='simple-input'>Age: <input type='number' min='0' name='age' value={this.props.bio.age} onChange={(event) => this.handleChange(event.target)}/></label>
                <Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
                <label className='simple-input'>Postcode: <input type='number' name='postcode' value={this.props.bio.postcode} onChange={(event) => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient email (optional): <input type='email' name='email' value={this.props.bio.email} onChange={(event) => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient mobile (optional): <input type='tel' name='phone' value={this.props.bio.phone}  onChange={(event) => this.handleChange(event.target)}/></label>
                </fieldset>
        )
    }
});

var PatientBio = ReactRedux.connect(function(s) { return {bio: s.bio} }, {update: bio.bio.action})(PatientBio);


var Interviewer = ReactRedux.connect(function(s) {
    return {interviewer: s.interviewer}
}, {update: bio.interviewer.action})(function(props) {

    return (
            <Question value={props.interviewer} onChange={input => props.update(input.value)} q={interviewerQuestion} />
    )
})

var BasicInfo = React.createClass({
    render: function() {
        return (
                <section id='basic-info'>
                <h1>Basic Information</h1>
                <Interviewer />
                <PatientBio />
                </section>
        );
    }
});

var Audit = ReactRedux.connect(
    ({survey, lastQuestion }) => ({ survey, lastQuestion }),
    {update: store.Answer }
)(AuditPage);

var Frames = React.createClass({
    render: function() {
        return (
                <section id='reminder'>
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

const fbPage = ReactRedux.connect(
    state => ({
        postStatus: state.postingSurvey,
        surveyScore: surveyScore(state.survey),
        dailyScore: dailyScore(state.survey),
        age: state.bio.age,
        gender: state.bio.gender
    }),
    { emailToPatient: email.emailToPatient, emailTo: email.emailTo }
)(Feedback)

var routeMap = {
    '/': [Intro, 'Start'],
    'info': [BasicInfo, 'Basic Info'],
    'audit': [Audit, 'AUDIT'],
    'feedback': [fbPage, 'Feedback'],
    'frames': [Frames, 'FRAMES']
}

var pageOrder = ['/', 'info', 'audit', 'feedback', 'frames']

var s = store.NewStore()
var h = createBrowserHistory()
h.listen(l => s.dispatch(history(l)))

initialiseLocation(s, Locations, bio.location.action)

var Survey = React.createClass({
    render: function() {
        return (
                <div>
                <Header />
                <ReactRedux.Provider store={s}>
                <Router history={h}>
                <Route path='/' component={Intro} />
                <Route path=':survey_page' component={SurveyPage} routeMap={routeMap} pageOrder={pageOrder}/>
                </Router>
                </ReactRedux.Provider>
                <config.debugPanel.component store={s} />
                </div>
        )
    }
});

export default Survey;
