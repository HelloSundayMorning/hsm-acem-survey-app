import * as config from 'config'
import { POSTING_SURVEY, SURVEY_POSTED, SURVEY_POST_FAILED, ANSWER,
    MailChimpList, MailChimpURL, MailChimpAuth } from 'src/constants'

function action(dispatch, getState) {
    postState(getState()).then(response => {
        if (response.status < 400) {
            dispatch({
                type: SURVEY_POSTED
            })
        } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).catch(failure.bind(null, dispatch))

    dispatch({
        type: POSTING_SURVEY
    })
}

function postState(state) {
    suscribeMailchimp (state);
    return fetch(config.apiRoot + '/surveys', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapState(state))
    })
}

function failure(dispatch, ex) {
    dispatch({
        type: SURVEY_POST_FAILED
    })

    throw ex
}


function suscribeMailchimp (state) {
  fetch(MailChimpURL + '/' + MailChimpList , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': MailChimpAuth
      },
      body: JSON.stringify({
        email_address: state.bio.email,
        status: 'subscribed'
      })
  })
}


function mapState({ location, bio, interviewer, survey, evaluation }) {
    return {
        interviewer,
        location,
        evaluation,
        patient: bio,
        answers: survey
    }
}

function answer(index, question, answer) {
    return {
        type: ANSWER,
        index,
        question,
        answer
    }
}

export default action

export {
    action,
    answer
}
