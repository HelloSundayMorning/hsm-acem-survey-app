import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import * as config from 'config'
import initialState from 'stores/initialState'

import { on, actionValue, actionType } from 'reducers/generic'

import * as survey from 'actions/survey'
import updateSurvey from 'reducers/survey'

import { type as HISTORY } from 'actions/history'
import routeChanged from 'reducers/routeChanged'

import * as bio from 'actions/bio'
import { default as bioReducer } from 'reducers/bio'

let reducerMap = {}
reducerMap[HISTORY] = routeChanged

reducerMap[bio.interviewer.type] = on('interviewer', actionValue)
reducerMap[bio.bio.type] = on('bio', bioReducer)
reducerMap[bio.location.type] = on('location', actionValue)

const postingSurvey = on('postingSurvey', actionType)
reducerMap[survey.posting] = postingSurvey
reducerMap[survey.posted] = postingSurvey
reducerMap[survey.postFailed] = postingSurvey

var ANSWER = 'ANSWER';

function Answer(index, question, answer) {
    return {
        type: ANSWER,
        index: index,
        question: question,
        answer: answer
    }
}


function surveyApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
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

const create = config.debugPanel.storeMiddleware(applyMiddleware(thunk))(createStore)

module.exports = {
    NewStore: () => {
        return create(surveyApp);
    },

    SurveyApp: surveyApp,

    Answer
}
