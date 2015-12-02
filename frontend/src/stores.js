var Redux = require('redux');

import initialState from 'stores/initialState'

import { on } from 'reducers/generic'

import updateSurvey from 'reducers/survey'

import { type as HISTORY } from 'actions/history'
import routeChanged from 'reducers/routeChanged'

import * as bio from 'actions/bio'

const actionValue = (_, action) => action.value
const actionFieldValue = (state, action) => on(action.field, actionValue)(state, action)

let reducerMap = {}
reducerMap[HISTORY] = routeChanged
reducerMap[bio.interviewer.type] = on("interviewer", actionValue)
reducerMap[bio.bio.type] = on("bio", actionFieldValue)


var ANSWER = 'ANSWER';
var EMAIL_TO_PATIENT = 'EMAIL_TO_PATIENT';
var EMAIL_TO = 'EMAIL_TO';

const SET_LOCATION = 'SET_LOCATION';

const Locations = ['Warrnambool', 'Clayton', 'Fitzroy', 'Geelong'];

function SetLocation(value) {
    return {
        type: SET_LOCATION,
        field: 'location',
        value: value
    }
}

function Answer(index, question, answer) {
    return {
        type: ANSWER,
        index: index,
        question: question,
        answer: answer
    }
}

function emailToPatient() {
    return {
        type: EMAIL_TO_PATIENT
    }
}

function emailTo() {
    return {
        type: EMAIL_TO
    }
}

function deliverEmail(state, email) {
    window.alert('to '+email+': '+JSON.stringify(state)+' to user');
}

function askAndDeliverEmail(state) {
    var res = window.prompt('Enter email address');
    deliverEmail(state, res);
}


function surveyApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    } else if (action.type === EMAIL_TO_PATIENT) {
        deliverEmail(state);
        return state;
    } else if (action.type === EMAIL_TO) {
        askAndDeliverEmail(state);
        return state;
    } else if (action.type === SET_LOCATION) {
        window.localStorage.setItem(LOCATION_KEY, action.value);
    } else if (action.type === ANSWER) {
        return Object.assign({}, state, updateSurvey(state, action))
    } else if (!!reducerMap[action.type]) {
        return reducerMap[action.type](state, action)
    }

    var newState = Object.assign({}, state);

    if (!!action.value) {
        newState[action.field] = action.value;
    } else {
        newState = state; // Don't make a new one
    }
    return newState;
}

var ReduxDev = require('redux-devtools');

var create = Redux.compose(ReduxDev.devTools())(Redux.createStore)

const LOCATION_KEY = 'location'

function initialiseLocation() {
    let s = window.localStorage
    var location = s.getItem(LOCATION_KEY);
    if (!location) {
        location = Locations[0]
    }
    initialState.location = location
}

module.exports = {
    NewStore: () => {
        initialiseLocation();
        return create(surveyApp);
    },

    SurveyApp: surveyApp,
    Locations,

    Answer,
    EmailToPatient: emailToPatient,
    EmailTo: emailTo,
    SetLocation
}
