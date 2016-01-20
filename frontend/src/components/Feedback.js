import React from 'react'
import { POSTING_SURVEY, SURVEY_POST_FAILED, EMAIL_SENDING, EMAIL_FAILED } from  'src/constants'
import { auditScoreGraphLink, frequencyGraphLink, riskFactorGraphLink }  from 'components/Graphs'
import { drinkPercentage, riskCategory, incidentRiskFactor, DEPENDENCE_LIKELY } from 'src/surveyResults'
import PoorSnackbar from 'components/PoorSnackbar'
import EmptyComponent from 'components/EmptyComponent'

function Feedback({ postStatus, emailStatus, emailToPatient, emailTo, surveyScore, dailyScore, age, gender }) {
    let Prompt = riskComponentMap[riskCategory(surveyScore)]

    return (
        <section id='feedback'>
            <PostingStatus status={postStatus} />

            <Prompt surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <div id='note'>
                *National Health and Medical Research Council. (2009). <em>Australian guidelines to reduce health risks from drinking alcohol.</em> Commonwealth of Australia: Australian Capital Territory.
            </div>

            <div id='section-buttons'>
                <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={emailToPatient}>Email to Patient</button>
                <button className='mdl-button mdl-button--raised mdl-button--colored'  onClick={emailTo}>Email to…</button>

                <EmailStatus key={emailStatus} status={emailStatus} />
            </div>
        </section>
    );
}

function PostingStatus({ status }) {
    let text = ''
    if (status === POSTING_SURVEY) {
        text  = 'Saving survey…'
    } else if (status === SURVEY_POST_FAILED) {
        text  = 'Failed to save survey.'
    } else {
        text  = 'Survey saved.'
    }
    return <PoorSnackbar text={text} />
}

function EmailStatus({ status }) {
    let text = ''
    if (status === null) {
        return <EmptyComponent />
    } else if (status === EMAIL_SENDING) {
        text = 'Sending email…'
    } else if (status === EMAIL_FAILED) {
        text = 'Failed to send email.'
    } else {
        text = 'Email sent.'
    }
    return <PoorSnackbar text={text} />
}

function LowRiskPrompt({ surveyScore, dailyScore, age, gender }) {
    return (
        <section className='lowRisk'>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <section className='instructions'>
                <h2>Tell your patient the following, and show them the graphs to illustrate:</h2>

                <blockquote>
                    <p>Your AUDIT score is {surveyScore} out of a maximum of 40.</p>

                    <p>Well Done! You are drinking within the recommended limits that reduce your risk of harm related to intoxication and chronic health problems associated with alcohol use.</p>
                </blockquote>
            </section>
        </section>
    )
}

const riskComponentMap = {
    'low-risk': LowRiskPrompt,
    'moderate-risk': ModerateHighRiskPrompt,
    'high-risk': ModerateHighRiskPrompt,
    'dependence-likely': ModerateHighRiskPrompt
}

function ModerateHighRiskPrompt({surveyScore, dailyScore, age, gender}) {
    const percentage = drinkPercentage(age, gender, dailyScore)

    let dependencePrompt = ''
    if (riskCategory(surveyScore) === DEPENDENCE_LIKELY) {
        dependencePrompt = DependencePrompt()
    }

    return (
        <section>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />


            <section className='instructions'>
                <h2>Tell your patient the following, and show them the graphs to illustrate:</h2>

                <blockquote>
                    <p>Your AUDIT score is {surveyScore} out of a maximum of 40.</p>

                    <p>The amount of alcohol that you are currently using increases your risk of harms from intoxication such as personal injury and long term health effects such as liver problems and cancer.</p>

                    <p>Your current alcohol use makes you {incidentRiskFactor[dailyScore]} to be hospitalised.</p>

                    <p>You drink more than {percentage}% of people of a similar age and gender.</p>

                    <p>And I can say that at the moment, the way you are using alcohol, that I am concerned for your health and safety.</p>

                    <p>What concerns you most about this information?</p>

                    <p>&lt;listen to response></p>

                    <p>How do you think you can reduce these risks?</p>

                    <p>&lt;listen to response></p>

                    <p>Hello Sunday Morning is an anonymous online support program that helps people feel better about drinking less. They will follow you up with an email or text message tomorrow with some steps to help you make a change.</p>
                </blockquote>
            </section>

            {dependencePrompt}

        </section>
    )
}

function DependencePrompt() {
    return (
        <section>
            <h2>Your patient is possibly dependent on alcohol and should receive further care by a specialist.</h2>

            <p>
                <strong>Tell your patient:</strong> “The answers you’ve given me indicate that you maybe dependent on alcohol. I am going to refer you to a drug and alcohol clinician now.”
            </p>

            <p>
                <strong>If out of hours or unavailable, tell your patient:</strong> “I am going to give you a card with contact details for DirectLine 24 hours counselling and referral in your area – (1800 888 236), and I will let your doctor here know.”
            </p>

        </section>
    )
}


function FeedbackCharts({ surveyScore, dailyScore, age, gender }) {
    return (
        <section id='feedback-charts'>
            <AuditScoreChart score={surveyScore} />
            <RiskFactorChart dailyScore={dailyScore} />
            <FrequencyChart age={age} gender={gender} dailyScore={dailyScore} />
        </section>
    )
}

function AuditScoreChart({ score }) {
    return <Chart title='AUDIT Score' url={auditScoreGraphLink(score)} />
}

function FrequencyChart({age, gender, dailyScore}) {
    return <Chart title='Drink Frequency' url={frequencyGraphLink(age, gender, dailyScore)} />
}

function RiskFactorChart({dailyScore}) {
    return <Chart title='Risk of hospitalisation' url={riskFactorGraphLink(dailyScore)} />
}

function Chart({title, url}) {
    return (
        <figure>
            <figcaption>{title}</figcaption>
            <img src={url} />
        </figure>
    )
}

export default Feedback
