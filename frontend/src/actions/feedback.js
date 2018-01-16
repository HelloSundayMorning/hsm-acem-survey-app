import * as config from 'config'
import {
    FEEDBACK_POSTING,
    FEEDBACK_POSTED,
    FEEDBACK_POST_FAILED
} from 'src/constants'

const post = () => dispatch => {
    const freeText = window.prompt('Enter feedback');
    if (!freeText || freeText.trim() === '') {
        return false;
    }

    dispatch({ type: FEEDBACK_POSTING })

    callFeedbackApi(freeText)
        .then(() => dispatch({ type: FEEDBACK_POSTED }))
        .catch(() => dispatch({ type: FEEDBACK_POST_FAILED }))
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
    })

export {
    post
}
