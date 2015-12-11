import * as config from 'config'
import { frequencyGraphLink, auditScoreGraphLink, riskFactorGraphLink } from 'components/Graphs'
import * as surveyData from 'src/surveyResults'

const emailSending = 'EMAIL_SENDING'
const emailSent = 'EMAIL_SENT'
const emailFailed = 'EMAIL_FAILED'

const emailToPatient = () => (dispatch, getState) => {
    const state = getState()
    const { bio: { email }} = state
    if (/@/.test(email)) {
        deliverEmail(email, state, dispatch)
    } else {
        askAndDeliverEmail(state, dispatch)
    }
}

const emailTo = () => (dispatch, getState) => {
    askAndDeliverEmail(getState(), dispatch)
}


function deliverEmail(email, state, dispatch) {
    dispatch({
        type: emailSending
    })

    postEmail(email, state).then(response => {
        if (response.status < 400) {
            dispatch({
                type: emailSent
            })
        } else {
            const error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }).catch(failure.bind(null, dispatch))
}

function failure(dispatch, ex) {
    dispatch({
        type: emailFailed
    })

    throw ex
}

function askAndDeliverEmail(state, dispatch) {
    var email = window.prompt('Enter email address');
    if (email !== null) {
        deliverEmail(email, state, dispatch);
    } // else user cancelled the prompt
}

function mapState(email, state) {
    const { age, gender } = state.bio
    const dailyScore = surveyData.dailyScore(state.survey)
    const surveyScore = surveyData.surveyScore(state.survey)
    const template = surveyData.riskCategory(surveyScore)  === surveyData.LOW_RISK ? 'low-risk' : 'high-risk'
    const riskFactorString = surveyData.incidentRiskFactor[dailyScore]

    return {
        Email: email,
        Template: template,
        FrequencyChart: frequencyGraphLink(age, gender, dailyScore),
        RiskChart: riskFactorGraphLink(dailyScore),
        AuditChart: auditScoreGraphLink(surveyScore),
        SurveyScore: surveyScore,
        RiskFactorString: riskFactorString,
        PopulationPercentage: surveyData.drinkPercentage(age, gender, dailyScore)
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
    emailTo,
    emailSending,
    emailSent,
    emailFailed
}
