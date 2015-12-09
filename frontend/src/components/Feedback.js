import React from 'react'
import { posting, postfailed } from  'actions/survey'
import { auditScoreGraphLink, frequencyGraphLink, riskFactorGraphLink }  from 'components/Graphs'
import { drinkPercentage, riskCategory, HIGH_RISK } from 'src/surveyResults'

function Feedback({ postStatus, emailToPatient, emailTo, surveyScore, dailyScore, age, gender }) {
    let Prompt = riskComponentMap[riskCategory(surveyScore)]

    return (
            <section id='feedback'>
            <PostingStatus status={postStatus} />
            <h1>Feedback ({surveyScore}, {dailyScore})</h1>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />
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

function EmpathyPrompt() {
    return <p>
        Empathy involves seeing the world through the client&#8217;s eyes, thinking about things as the client thinks about them, feeling things as the client feels them, sharing in the client&#8217;s experiences. Expression of empathy is critical to the MI approach. When clients feel that they are understood, they are more able to open up to their own experiences and share those experiences with others. Having clients share their experiences with you in depth allows you to assess when and where they need support, and what potential pitfalls may need focused on in the change planning process. Importantly, when clients perceive empathy on a counsellor&#8217;s part, they become more open to gentle challenges by the counsellor about lifestyle issues and beliefs about substance use. Clients become more comfortable fully examining their ambivalence about change and less likely to defend ideas like their denial of problems, reducing use vs. abstaining, etc. In short, the counsellor&#8217;s accurate understanding of the client&#8217;s experience facilitates change.
        </p>
}

function LowRiskPrompt() {
    return (
            <section className='lowRisk'>
            <h1>Low Risk</h1>

            <EmpathyPrompt />

            <p>
            Well Done! You are drinking within the recommended limits that reduce your risk of harm related to intoxication and chronic health problems associated with alcohol use.
            </p>
            </section>
    )
}

const incidentRiskFactor = {
    0: 'unlikely', // 1 or 2
    1: 'twice as likely', // 3 or 4
    2: '3 times more likely', // 5 or 6
    3: '4-6 times more likely', // 7, 8 or 9
    4: '7 times more likely' // 10 or more
}

const riskComponentMap = {
    "low-risk": LowRiskPrompt,
    "moderate-risk": ModerateHighRiskPrompt,
    "high-risk": ModerateHighRiskPrompt,
    "dependence-likely": DependentPrompt
}

function ModerateHighRiskPrompt({surveyScore, dailyScore, age, gender}) {
    const highRisk = riskCategory(surveyScore) === HIGH_RISK
    const percentage = drinkPercentage(age, gender, dailyScore)

    return (
            <section className={highRisk ? 'high-risk' : 'moderate' }>
            <h1>{highRisk ? 'High Risk' : 'Moderate Risk'}</h1>

            <EmpathyPrompt />

            <p>Your answers indicate that you are a {highRisk ? 'high risk' : 'moderate' } drinker.</p>

            <p>The amount of alcohol that you are currently using increases your risk of harms from intoxication such as personal injury and long term health effects such as liver problems and cancer.</p>

            <p>Your current alcohol use makes you {incidentRiskFactor[dailyScore]} to be hospitalised.</p>

            <p>You drink more than {percentage}% of people of a similar age and gender.</p>

            <p>And I can say that at the moment, the way you are using alcohol, that I am concerned for your health and safety.</p>

            <h2>Responsibility</h2>

            <p>We now know that there are some simple and easy ways to reduce your risk of harm from alcohol use, but of course, the only person who can make these changes is you.</p>

            <h2>Advice & menu of options combined (under MI elicit-provide elicit)</h2>

            <p><strong>E.</strong> Can you think of any ways that you could reduce your harms from alcohol? (active listening prompt / affirmations and reflections on answers)</p>

            <p><strong>P.</strong> Some of these might not apply to you, but as I mentioned, there are some really simple things that you can do that are effective in reducing the harms of alcohol.  Can I tell you about them?</p>

            <h2>MENU</h2>

            <p>Medical guidelines recommend; No more than 2 std drinks per day and No more than 4 std drinks in one sitting, as your risk of personal injury increases with every standard drink over this amount.</p>

            <p>Some simple ways to reduce the amount you drink are;</p>

            <ul>
            <li>Space your drinks out with non-alcoholic drinks.</li>
            <li>Eat before drinking alcohol and throughout the night if you are out.</li>
            <li>Have a plan about how much you are going to drink, or how much you are going to spend before going out and stick to it.</li>
            </ul>

            <p><strong>E.</strong> Do you think that any of these ideas would work for you?</p>

            <p><strong>P.</strong>  Another way that you can reduce your harms is by engaging with a non-biased, supportive community, like the people at HSM, where you can (set your own goals, get support and track your progress).</p>

            <p><strong>E.</strong> Is this something that interests you?</p>

            <h2>Self-efficacy. (goal setting)</h2>

            <p>So what do you think you’ll do?</p>

            <h2>Closure</h2>

            <p>Committed to change/goal – That’s sounds like a great plan.</p>

            <p>If not committed to change/plan – ok, I can see you aren’t quite ready to make any changes yet.</p>
            </section>
    )
}

function DependentPrompt() {
    return (
            <section className='dependent'>
            <h1>Dependence Likely</h1>

            <EmpathyPrompt />

            <p>The answers that you have provided today indicate that you are currently using alcohol at a level that is likely harming your health, and that if you would like to safely change the amount that you are using, that this should be done after discussing it with your GP or a drug and alcohol worker.</p>

            <h2>Dependency Advice/Menu</h2>

            <p><strong>E.</strong> Are you worried about the amount of alcohol that you are using at the moment?</p>

            <p><strong>P.</strong> There are a few options that might be helpful if you would like me to tell you about them;</p>

            <h2>Menu</h2>

            <p>Referral to drug and alcohol specialist while you are here</p>

            <p>You could make an appointment with a GP and ask them to support you in cutting down over time.</p>

            <p>You could get a referral from your GP for a MHCP and find a counsellor to help you change your drinking.</p>

            <p>You could call directline and ask for an assessment with your local drug and alcohol service, and they could help you with changing your drinking.</p>

            <p><strong>E.</strong> Do you think that any of these ideas would work for you?</p>

            <h2>Self-efficacy. (goal setting)</h2>

            <p>So what do you think you’ll do?</p>

            <h2>Referral to Local AOD service</h2>

            <p>Please alert your local Alcohol and Other Drug service worker to screen this patient for possible alcohol dependency and further management.</p>

            <h2>Closure</h2>

            <p>Committed to change/goal – That’s sounds like a great plan.</p>

            <p>If not committed to change/plan – ok, I can see you aren’t quite ready to make any changes yet.</p>

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
    return <Chart title="AUDIT Score" url={auditScoreGraphLink(score)} />
}

function FrequencyChart({age, gender, dailyScore}) {
    return <Chart title="Drink Frequency" url={frequencyGraphLink(age, gender, dailyScore)} />
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
