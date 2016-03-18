import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import * as config from 'config'
import * as actions from 'src/constants'

import reducer from 'reducers'

function Answer(index, question, answer) {
    return {
        type: actions.ANSWER,
        index,
        question,
        answer
    }
}

const create = config.debugPanel.storeMiddleware(applyMiddleware(thunk))(createStore)

module.exports = {
    NewStore: () => create(reducer),

    SurveyApp: reducer,

    Answer
}
