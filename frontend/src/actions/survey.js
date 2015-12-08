const posting = 'POSTING_SURVEY'
const posted = 'SURVEY_POSTED'
const postFailed = 'SURVEY_POST_FAILED'

function action(dispatch, getState) {
    postState(getState()).then(response => {
        if (response.status < 400) {
            dispatch({
                type: posted
            })
        } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).catch(failure.bind(null, dispatch))

    dispatch({
        type: posting
    })
}

function postState(state) {
    return fetch(__API_URL__ + '/surveys', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapState(state))
    })
}

function failure(dispatch, ex) {
    // FIXME Log this error into...?
    dispatch({
        type: postFailed
    })
}

function mapState({ location, bio, interviewer, survey }) {
    return {
        interviewer,
        location,
        patient: bio,
        answers: survey
    }
}

export default action

export {
    action,
    posting,
    posted,
    postFailed
}
