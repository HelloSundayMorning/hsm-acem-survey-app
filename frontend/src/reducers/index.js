import { combineReducers } from 'redux';

import initialState from 'stores/initialState'

import * as actions from 'src/constants'

import { on, actionValue } from 'reducers/generic'
import updateSurvey from 'reducers/survey'
import routeChanged from 'reducers/routeChanged'
import { default as bioReducer } from 'reducers/bio'

let reducerMap = {}
reducerMap[actions.HISTORY] = routeChanged

reducerMap[actions.UPDATE_BIO] = on('bio', bioReducer)
reducerMap[actions.UPDATE_LOCATION] = on('location', actionValue)

const interviewer = (s = null, a) => {
    if (a.type === actions.SET_INTERVIEWER) {
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
    postingSurvey
})

function surveyApp(state = initialState, action) {
    if (action.type === actions.ANSWER) {
        return Object.assign({}, state, updateSurvey(state, action))
    } else if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action)
    }
    return Object.assign({}, state, combined(state, action))
}

export default surveyApp
