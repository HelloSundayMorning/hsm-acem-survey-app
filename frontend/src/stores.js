var Redux = require('redux');

import updateSurvey from 'reducers/survey'

var UPDATE_BIO = 'UPDATE_BIO';
var ANSWER = 'ANSWER';
var SET_INTERVIEWER = 'SET_INTERVIEWER';
var EMAIL_TO_PATIENT = 'EMAIL_TO_PATIENT';
var EMAIL_TO = 'EMAIL_TO';

const SET_LOCATION = 'SET_LOCATION';

const Locations = ['Warrnambool', 'Clayton', 'Fitzroy', 'Geelong'];


var initialState = {
    bio: {},
    survey: [],
    lastQuestion: 0,
    interviewer: null,
    location: ''
}

function SetLocation(value) {
    return {
        type: SET_LOCATION,
        field: 'location',
        value: value
    }
}

function SetInterviewer(value) {
    return {
        type: SET_INTERVIEWER,
        field: 'interviewer',
        value: value
    };
}

function UpdateBio(field, value) {
    return {
        type: UPDATE_BIO,
        field: 'bio',
        fn: function(state) {
            var update = {}
            update[field] = value
            return Object.assign({}, state, update)
        }
    };
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
    }

    var newState = Object.assign({}, state);

    if (!!action.value) {
        newState[action.field] = action.value;
    } else if (!!action.fn) {
        var field = state[action.field];
        newState[action.field] = action.fn(field);
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

    UpdateBio,
    Answer,
    SetInterviewer,
    EmailToPatient: emailToPatient,
    EmailTo: emailTo,
    SetLocation
}
