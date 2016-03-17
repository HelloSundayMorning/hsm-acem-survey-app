import * as config from 'config'
import {
    FEEDBACK_POSTING,
    FEEDBACK_POSTED,
    FEEDBACK_POST_FAILED
} from 'src/constants'

const post = freeText => dispatch => {
    dispatch({ type: FEEDBACK_POSTING, message: 'Sending feedback…' })

    callFeedbackApi(freeText)
        .then(() => dispatch({ type: FEEDBACK_POSTED, message: 'Feedback sent.' }))
        .catch(() => dispatch({ type: FEEDBACK_POST_FAILED, message: 'Failed to send feedback.' }))
}

const callFeedbackApi = freeText =>
    fetch(config.apiRoot + '/surveys/feedback', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            FreeText: freeText
        })
    })
    .then(response => {
        if (response.status >= 400) {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
        return response;
    })
    .then(response => response.json())

export {
    post
}
