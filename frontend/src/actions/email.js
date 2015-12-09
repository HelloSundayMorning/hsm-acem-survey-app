import * as config from 'config'
import { frequencyGraphLink, auditScoreGraphLink, riskFactorGraphLink } from 'components/Graphs'
import * as surveyData from 'src/surveyResults'

const emailToPatient = () => (dispatch, getState) => {
    const state = getState()
    const { bio: { email }} = state
    if (/@/.test(email)) {
        deliverEmail(email, state)
    } else {
        askAndDeliverEmail(state)
    }
}

const emailTo = () => (dispatch, getState) => {
    askAndDeliverEmail(getState())
}


function deliverEmail(email, state) {
    postEmail(email, state).then(response => {
        if (response.status < 400) {
            // FIXME Do what on success?
        } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).catch(failure)
}

function failure(ex) {
    // FIXME Log this error into...?
}

function askAndDeliverEmail(state) {
    var email = window.prompt('Enter email address');
    if (email !== null) {
        deliverEmail(email, state);
    } // else user cancelled the prompt
}

function mapState(email, state) {
    const { age, gender } = state.bio
    const dailyScore = surveyData.dailyScore(state.survey)
    const surveyScore = surveyData.surveyScore(state.survey)
    const template = surveyData.riskCategory(surveyScore)

    return {
        Email: 'bodhi@theplant.jp',
        Template: template,
        FrequencyChart: `<img src="${frequencyGraphLink(age, gender, dailyScore)}">`,
        RiskChart: `<img src="${riskFactorGraphLink(dailyScore)}">`,
        AuditChart: `<img src="${auditScoreGraphLink(surveyScore)}">`
    }
}

function postEmail(email, state) {
    return fetch(config.apiRoot + '/surveys/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mapState(email, state))
    })
}


export {
    emailToPatient,
    emailTo
}
