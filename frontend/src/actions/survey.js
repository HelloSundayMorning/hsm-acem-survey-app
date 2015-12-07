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
            failure(dispatch)
        }
    }).catch(failure.bind(null, dispatch))

    dispatch({
        type: posting
    })
}

function postState(state) {
    console.log("getting", state)
    return fetch('http://localhost:8000')
}

function failure(dispatch, ex) {
    dispatch({
        type: postFailed
    })
}

export default action

export {
    action,
    posting,
    posted,
    postFailed
}
