require('normalize.css');
require('styles/mdl.css');
require('styles/App.scss');
require('styles/responsive.scss');

import React from 'react'
import * as ReactRedux from 'react-redux';
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useScrollToTop'
import Interviewer from 'components/Interviewer'
import PatientBio from 'components/PatientBio'
import AuditPage from 'components/AuditPage'
import SurveyPage from 'components/SurveyPage'
import Feedback from 'components/Feedback'
import Frames from 'components/FramesReminder'
import FeedbackSection from 'components/FeedbackSection'
import { Continue } from 'components/Footer'
import Guidelines from 'components/NHMRCGuidelines'

import history from 'actions/history'
import * as email from 'actions/email'
import { answer } from 'actions/survey'
import { post as postFeedback } from 'actions/feedback'

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

var Intro = ReactRedux.connect(state => ({state}), { update: bio.location.action, postFeedback })(function(props) {
    return (
        <div className='survey-page'>
            <section id='intro'>
                <Interviewer />

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
                    <select value={props.state.location} onChange={({target: {value}}) => updateLocation(value, props.update)}>
                        {Locations.map(l => <option key={l} value={l}>{l}</option> )}
                    </select>
                    <div id='start-button'>
                        <Continue className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' link='/info' label='Start' state={props.state}/>
                        <FeedbackSection status={props.state.postingFeedback} onPost={props.postFeedback} />
                    </div>
                </div>

                <Guidelines/>
            </footer>
        </div>
    );
})

var Audit = ReactRedux.connect(
    ({survey, lastQuestion }) => ({ survey, lastQuestion }),
    {update: answer }
)(AuditPage);

const fbPage = ReactRedux.connect(
    state => ({
        postStatus: state.postingSurvey,
        emailStatus: state.postingEmail,
        surveyScore: surveyScore(state.survey),
        dailyScore: dailyScore(state.survey),
        email: state.bio.email,
        age: state.bio.age,
        gender: state.bio.gender
    }),
    { emailToPatient: email.emailToPatient, emailTo: email.emailTo }
)(Feedback)

var routeMap = {
    '/': [Intro, 'Start'],
    'info': [PatientBio, 'Patient Info'],
    'audit': [Audit, 'AUDIT'],
    'feedback': [fbPage, 'Feedback'],
    'frames': [Frames, 'FRAMES']
}

var pageOrder = ['/', 'info', 'audit', 'feedback', 'frames']

var s = store.create()
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
