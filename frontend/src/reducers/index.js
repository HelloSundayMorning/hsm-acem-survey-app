import { combineReducers } from 'redux';

import initialState from 'stores/initialState'

import * as actions from 'src/constants'

import updateSurvey from 'reducers/survey'
import routeChanged from 'reducers/routeChanged'
import bio from 'reducers/bio'

// Returns handler(s, a) when `a.type` is in `actions`, otherwise
// state is unchanged
const when = handler => (...actions) => (s = null, a) => {
    if (actions.indexOf(a.type) >= 0) {
        return handler(s, a)
    }
    return s
}

// Reducer combinators that accepts a list of actions, and will return
// the value or type of the action when action matches the passed
// types.
const actionValue = when((_, a) => a.value);
const actionType = when((_, a) => a.type);

const interviewer = actionValue(actions.SET_INTERVIEWER);
const location = actionValue(actions.UPDATE_LOCATION);
const postingEmail = actionType(
    actions.EMAIL_SENDING,
    actions.EMAIL_SENT,
    actions.EMAIL_FAILED
);
const postingSurvey = actionType(
    actions.POSTING_SURVEY,
    actions.SURVEY_POSTED,
    actions.SURVEY_POST_FAILED
);

const id = (a = null) => a

const combined = combineReducers({
    interviewer,
    postingEmail,
    postingSurvey,
    bio,
    location,
    survey: id,
    lastQuestion: id
});

function surveyApp(state = initialState, action) {
    switch (action.type) {
    case actions.ANSWER:
        return updateSurvey(state, action);
    case actions.HISTORY:
        return routeChanged(state, action);
    }
    return combined(state, action)
}

export default surveyApp
