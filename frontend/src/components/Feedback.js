import React from 'react'
import { connect } from 'react-redux';
import { EMAIL_SENDING, EMAIL_FAILED, EMAIL_SENT } from  'src/constants'
import { surveyScore, dailyScore } from 'src/surveyResults'
import { evaluate } from 'actions/bio'
import * as email from 'actions/email'
import { auditScoreGraphLink, frequencyGraphLink, riskFactorGraphLink }  from 'components/Graphs'
import { drinkPercentage, riskCategory, incidentRiskFactor, DEPENDENCE_LIKELY } from 'src/surveyResults'
import Question from 'components/Question'
import { StatusBar } from 'components/PoorSnackbar'

var evaluationQuestion = {
    text: 'Do you think this person will reduce their harmful drinking?',
    key: 'clinical_evaluation',
    answers: [
        {key: 'will_reduce', text: 'Yes'},
        {key: 'wont_reduce', text: 'No'},
        {key: 'unsure', text: 'Unsure'}
    ]
}

function Feedback({
    email,
    emailStatus,
    emailToPatient,
    emailTo,
    surveyScore,
    dailyScore,
    age,
    gender,
    evaluation,
    evaluate
}) {
    let Prompt = riskComponentMap[riskCategory(surveyScore)]

    return (
        <section id='feedback'>
            <h1>Patient Feedback</h1>

            <Prompt surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <div id='note'>
                *National Health and Medical Research Council. (2009). <em>Australian guidelines to reduce health risks from drinking alcohol.</em> Commonwealth of Australia: Australian Capital Territory.
            </div>

            <EmailNotice email={email} />
            <div id='section-buttons'>
                <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={emailToPatient}>Email to Patient</button>
                <button className='mdl-button mdl-button--raised mdl-button--colored'  onClick={emailTo}>Email to…</button>

                <EmailStatus key={emailStatus} status={emailStatus} />
            </div>


            <Question
                value={evaluation}
                onChange={input => evaluate(input.value)}
                q={evaluationQuestion}
            />
        </section>
    );
}

const EmailNotice = ({ email }) => {
    if (!email || email.trim().length === 0) {
        return <h2>Say: “We would like to email you some information and a link to a mobile app that you might find useful. Can I ask you for your email address?”</h2>
    } else {
        return <div />
    }
}

const emailStatusMap = {
    [EMAIL_SENDING]: 'Sending email…',
    [EMAIL_FAILED]: 'Failed to send email.',
    [EMAIL_SENT]: 'Email sent.'
};

const EmailStatus = StatusBar(emailStatusMap);

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
    const percentage = drinkPercentage(age, gender, surveyScore, dailyScore)

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

                    <p>{incidentRiskFactor[dailyScore]}</p>

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
                <strong>Tell your patient:</strong> “The answers you’ve given me indicate that you may be dependent on alcohol. I am going to refer you to a drug and alcohol clinician now.”
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
            <FrequencyChart age={age}
                            gender={gender}
                            surveyScore={surveyScore}
                            dailyScore={dailyScore}
            />
        </section>
    )
}

function AuditScoreChart({ score }) {
    return <Chart title='AUDIT Score' url={auditScoreGraphLink(score)} />
}

function FrequencyChart({age, gender, surveyScore, dailyScore}) {
    return <Chart title='Drink Frequency'
                  url={frequencyGraphLink(age, gender, surveyScore, dailyScore)}
           />
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

export default connect(
    state => ({
        emailStatus: state.postingEmail,
        surveyScore: surveyScore(state.survey),
        dailyScore: dailyScore(state.survey),
        email: state.bio.email,
        age: state.bio.age,
        gender: state.bio.gender,
        evaluation: state.evaluation
    }),
    {
        emailToPatient: email.emailToPatient,
        emailTo: email.emailTo,
        evaluate: evaluate.action
    }
)(Feedback)
