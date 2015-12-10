import React from 'react'
import { posting, postfailed } from  'actions/survey'
import { auditScoreGraphLink, frequencyGraphLink, riskFactorGraphLink }  from 'components/Graphs'
import { drinkPercentage, riskCategory, incidentRiskFactor, DEPENDENCE_LIKELY } from 'src/surveyResults'

function Feedback({ postStatus, emailToPatient, emailTo, surveyScore, dailyScore, age, gender }) {
    let Prompt = riskComponentMap[riskCategory(surveyScore)]

    return (
            <section id='feedback'>
            <PostingStatus status={postStatus} />

            <Prompt surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <div id='section-buttons'>
            <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={emailToPatient}>Email to Patient</button>
            <button className='mdl-button mdl-button--raised mdl-button--colored'  onClick={emailTo}>Email to…</button>
            </div>
            </section>
    );
}

function PostingStatus({ status }) {
    if (status == posting) {
        return <p>Posting survey</p>
    } else if (status == postfailed) {
        return <p>failed to post survey</p>
    } else {
        return <p>Posted survey</p>
    }
}

function LowRiskPrompt({ surveyScore, dailyScore, age, gender }) {
    return (
            <section className='lowRisk'>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <p>Tell your patient the following, and show them the graphs to illustrate:</p>

            <blockquote>
            <p>Your AUDIT score is {surveyScore} out of a maximum of 40.</p>

            <p>Well Done! You are drinking within the recommended limits that reduce your risk of harm related to intoxication and chronic health problems associated with alcohol use.</p>
            </blockquote>
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
        dependencePrompt = <p>
            Your patient is possibly dependent on alcohol and should receive further care by a specialist. Tell your patient: “I would like you to speak with our Drug and Alcohol specialist. If it’s OK with you, I’ll ask them to come and speak with you.
            </p>
    }

    return (
            <section>

            <p>Tell your patient the following, and show them the graphs to illustrate:</p>

            <blockquote>
            <p>Your AUDIT score is {surveyScore} out of a maximum of 40.</p>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <p>The amount of alcohol that you are currently using increases your risk of harms from intoxication such as personal injury and long term health effects such as liver problems and cancer.</p>

            <p>Your current alcohol use makes you {incidentRiskFactor[dailyScore]} to be hospitalised.</p>

            <p>You drink more than {percentage}% of people of a similar age and gender.</p>

            <p>And I can say that at the moment, the way you are using alcohol, that I am concerned for your health and safety.</p>

            <p>Do you think you are drinking too much?</p>

            <p>&lt;listen to response></p>

            <p>Do you want to change how much you are drinking?</p>

            <p>&lt;listen to response></p>

            <p>Hello Sunday Morning is an anonymous online support program that helps people feel better about drinking less. They will follow you up with an email or text message tomorrow with some steps to help you make a change.</p>
            </blockquote>

        {dependencePrompt}

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
    return <Chart title='Risks of Harm' url={riskFactorGraphLink(dailyScore)} />
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
