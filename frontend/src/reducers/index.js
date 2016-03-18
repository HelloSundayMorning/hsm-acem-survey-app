import { combineReducers } from 'redux';

import initialState from 'stores/initialState'

import * as actions from 'src/constants'

import updateSurvey from 'reducers/survey'
import routeChanged from 'reducers/routeChanged'
import bio from 'reducers/bio'

const interviewer = (s = null, a) => {
    if (a.type === actions.SET_INTERVIEWER) {
        return a.value
    }
    return s
}

const location = (s = null, a) => {
    if (a.type === actions.UPDATE_LOCATION) {
        return a.value
    }
    return s
}

const postingEmail = (s = null, a) => {
    switch (a.type) {
    case actions.EMAIL_SENDING:
    case actions.EMAIL_SENT:
    case actions.EMAIL_FAILED:
        return a.type
    }
    return s
}

const postingSurvey = (s = null, a) => {
    switch (a.type) {
    case actions.POSTING_SURVEY:
    case actions.SURVEY_POSTED:
    case actions.SURVEY_POST_FAILED:
        return a.type
    }
    return s
}

const combined = combineReducers({
    interviewer,
    postingEmail,
    postingSurvey,
    bio,
    location
});

function surveyApp(state = initialState, action) {
    if (action.type === actions.ANSWER) {
        return updateSurvey(state, action)
    } else if (action.type === actions.HISTORY) {
        return routeChanged(state, action)
    }
    return Object.assign({}, state, combined(state, action))
}

export default surveyApp
