require('normalize.css');
require('styles/mdl.css');
require('styles/App.scss');
require('styles/responsive.scss');

import React from 'react'
import * as ReactRedux from 'react-redux';
import { Router, Route, Link } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useScrollToTop'
import Question from 'components/Question'
import AuditPage from 'components/AuditPage'
import SurveyPage from 'components/SurveyPage'
import Feedback from 'components/Feedback'
import Frames from 'components/FramesReminder'
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
                    <div id='start-button'>
                        <Link id='start-survey' className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' to='/info'>Start</Link>
                    </div>
                </div>



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
        {key: 'allied', text: 'Allied Health'},
        {key: 'other', text: 'Other'}
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
    handleChange(input) {
        this.props.update(input.value, input.name)
    },
    render() {
        return (
            <fieldset id='patient-bio'>
                <legend>Patient Information</legend>
                <Question q={genderQuestion} onChange={this.handleChange} value={this.props.bio.gender}  />
                <label className='simple-input'>Age (must be between 12 and 110): <input type='number' min='12' max ='110' name='age' value={this.props.bio.age} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Postcode: <input type='number' name='postcode' value={this.props.bio.postcode} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient email (optional): <input type='email' name='email' value={this.props.bio.email} onChange={event => this.handleChange(event.target)}/></label>
                <label className='simple-input'>Patient mobile (optional): <input type='tel' name='phone' value={this.props.bio.phone}  onChange={event => this.handleChange(event.target)}/></label>
            </fieldset>
        )
    }
});

PatientBio = ReactRedux.connect(function(s) { return {bio: s.bio} }, {update: bio.bio.action})(PatientBio);


var Interviewer = ReactRedux.connect(function(s) {
    return {interviewer: s.interviewer}
}, {update: bio.interviewer.action})(function(props) {

    return (
        <Question value={props.interviewer} onChange={input => props.update(input.value)} q={interviewerQuestion} />
    )
})

var BasicInfo = React.createClass({
    render() {
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

const fbPage = ReactRedux.connect(
    state => ({
        postStatus: state.postingSurvey,
        emailStatus: state.postingEmail,
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
var h = useScroll(createBrowserHistory)()
h.listen(l => s.dispatch(history(l)))

initialiseLocation(s, Locations, bio.location.action)

var Survey = React.createClass({
    render() {
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
