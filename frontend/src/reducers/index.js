import initialState from 'stores/initialState'

import * as actions from 'src/constants'

import { on, actionValue, actionType } from 'reducers/generic'
import updateSurvey from 'reducers/survey'
import routeChanged from 'reducers/routeChanged'
import { default as bioReducer } from 'reducers/bio'

let reducerMap = {}
reducerMap[actions.HISTORY] = routeChanged

reducerMap[actions.SET_INTERVIEWER] = on('interviewer', actionValue)
reducerMap[actions.UPDATE_BIO] = on('bio', bioReducer)
reducerMap[actions.UPDATE_LOCATION] = on('location', actionValue)

const postingSurvey = on('postingSurvey', actionType)
reducerMap[actions.POSTING_SURVEY] = postingSurvey
reducerMap[actions.SURVEY_POSTED] = postingSurvey
reducerMap[actions.SURVEY_POST_FAILED] = postingSurvey

const postingEmail = on('postingEmail', actionType)
reducerMap[actions.EMAIL_SENDING] = postingEmail
reducerMap[actions.EMAIL_SENT] = postingEmail
reducerMap[actions.EMAIL_FAILED] = postingEmail


function surveyApp(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    } else if (action.type === actions.ANSWER) {
        return Object.assign({}, state, updateSurvey(state, action))
    } else if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action)
    }

    var newState = Object.assign({}, state);

    if (action.value) {
        newState[action.field] = action.value;
    } else {
        newState = state; // Don't make a new one
    }
    return newState;
}

export default surveyApp