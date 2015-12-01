import React from 'react'

function Feedback({ emailToPatient, emailTo, surveyScore, dailyScore, age, gender }) {
    let Prompt = DependentPrompt
    if (surveyScore <= 7) {
        Prompt = LowRiskPrompt
    } else if (surveyScore <= 19) {
        Prompt = ModerateHighRiskPrompt
    }

    return (
            <section id='feedback'>
            <h1>Feedback ({surveyScore}, {dailyScore})</h1>

            <FeedbackCharts surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />
            <Prompt surveyScore={surveyScore} dailyScore={dailyScore} age={age} gender={gender} />

            <p>Looking at this information, how do you feel about your level of drinking?</p>

            <p>Only you can make the decision to change your consumption. Here are some strategies you can try if you want to cut back:</p>

            <ul>
            <li>Setting personal drinking limits and sticking to it;</li>
            <li>Alternating alcoholic drinks with soft drinks;</li>
            <li>Switching to low alcohol drinks;</li>
            <li>Having regular alcohol-free days;</li>
            <li>Identifying high risk situations for heavy drinking and creating a management plan;</li>
            <li>Engaging in alternative activities to drinking</li>
            </ul>

            <div id='section-buttons'>
            <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={emailToPatient}>Email to Patient</button>
            <button className='mdl-button mdl-button--raised mdl-button--colored'  onClick={emailTo}>Email to…</button>
            </div>
            </section>
    );
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

//////////////////////////////////////////
// Data from document attached to: https://qortex.com/theplant#groups/56496e5d8d93e31c8210ef3d/entry/56496e9b8d93e31c8210efa1/cid/56539b8f8d93e30d5e0268ab
const incidentRiskFactor = {
    0: 'unlikely', // 1 or 2
    1: 'twice as likely', // 3 or 4
    2: '3 times more likely', // 5 or 6
    3: '4-6 times more likely', // 7, 8 or 9
    4: '7 times more likely' // 10 or more
}

const consumptionRateData = {
    male: [
        { maxAge: 17,   abstain: 71.4, lowRisk: 25.2, risky:  3.3 },
        { maxAge: 24,   abstain: 16.5, lowRisk: 55.9, risky: 27.6 },
        { maxAge: 29,   abstain: 13.6, lowRisk: 54.5, risky: 31.9 },
        { maxAge: 39,   abstain: 14.8, lowRisk: 56.8, risky: 28.3 },
        { maxAge: 49,   abstain: 14.5, lowRisk: 53.9, risky: 31.7 },
        { maxAge: 59,   abstain: 15.1, lowRisk: 57.0, risky: 28.0 },
        { maxAge: 69,   abstain: 18.0, lowRisk: 53.5, risky: 28.6 },
        { maxAge: 9999, abstain: 23.3, lowRisk: 59.3, risky: 17.4 } // 9999 = 70+
    ],
    female: [
        { maxAge: 17,   abstain: 73.3, lowRisk: 25.0, risky:  1.7 },
        { maxAge: 24,   abstain: 18.0, lowRisk: 67.5, risky: 14.6 },
        { maxAge: 29,   abstain: 20.5, lowRisk: 69.7, risky:  9.8 },
        { maxAge: 39,   abstain: 21.1, lowRisk: 69.6, risky:  9.3 },
        { maxAge: 49,   abstain: 17.1, lowRisk: 69.4, risky: 13.5 },
        { maxAge: 59,   abstain: 19.0, lowRisk: 68.8, risky: 12.3 },
        { maxAge: 69,   abstain: 24.4, lowRisk: 67.0, risky:  8.6 },
        { maxAge: 9999, abstain: 40.3, lowRisk: 55.6, risky:  4.1 } // 9999 = 70+
    ]
}
//////////////////////////////////////////

function consumptionRates(age, gender) {
    if (gender == 'other') {
        gender = 'female'
    }
    const rates = consumptionRateData[gender]
    return rates.find(({maxAge}) => age < maxAge)
}

function drinkPercentage(age, gender, dailyScore) {
    const rate = consumptionRates(age, gender)
    let percentage = rate.abstain;
    if (dailyScore > 0) {
        percentage += rate.lowRisk;
    }
    return percentage;
}

function ModerateHighRiskPrompt({surveyScore, dailyScore, age, gender}) {
    const highRisk = surveyScore >= 16;
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

const defaults = [
    `chs=250x200` // Size
]

function AuditScoreChart({ score }) {
    const average = 10

    const max = 40 // Maximum survey score
    const recommended = 7 // Recommended survey score
    const rangeMax = max + 5 // Top value of the graph
    const data = [
        `cht=bvs`, // Column chart
        `chbh=r,1.0`, // Column spacing
        `chds=0,${rangeMax}`, // Scale the Y values
        `chd=t:${average},${score}`, // data
        `chxl=0:|Average|You|1:|Recomm.+Max|Score+Max`, // Axis labels
        `chxt=x,y`, // Show x and y axes
        `chxr=1,0,${rangeMax}`, // Scale Y axis
        `chxp=1,${recommended},${max}`, // Axis label position
        `chxtc=1,-500`, // Axis tick length
        `chxs=0,,16|1,,16`, // Axis Label format
        `chma=0,0,0,53` // LRTB Margins, RiskFactor has a double axis label at bottom, so compensate with bigger bottom margin
    ]
    return <Chart title="AUDIT Score" params={data} />
}

function FrequencyChart({age, gender, dailyScore}) {
    const percentage = drinkPercentage(age, gender, dailyScore)/100

    const data = [
        `cht=p`, // Pie chart
        `chd=t:${percentage},${1-percentage}`, // Data
        `chdl=Less+than+you|More+than+you`, // Data labels
        `chdlp=b`, // Legend position
        `chp=-1.571`, // Initial angle (Pi/2)
        `chdls=,16` // Legend style
    ]
    return <Chart title="Drink Frequency" params={data} />
}

const riskFactor = {
    0: '0,1|0,1', // 0-2 = 1x
    1: '0,3|0,2', // 3-4 = 2x
    2: '0,5|0,3', // 5-6 = 3x
    3: '0,7|0,4', // 7-8,9 = 4x (survey has 7-9 but table breaks into 7-8 @ 4x & 9 @ 6x)
    4: '0,10|0,7' // 10+ = 7x
}

function RiskFactorChart({dailyScore}) {
    const data = [
        `cht=lxy`, // X-Y line
        `chxt=x,y,x,y`, // Axes displayed: 2 & 3 (0-based) are for axis labels
        `chls=3`, // Line style

        // Series 0 is static data of risk factor graph
        // Series 1 is a fake point, then the risk factor point for the daily score
        `chd=t:1,3,5,7,9,10|1,2,3,4,6,7|${riskFactor[dailyScore]}`,

        `chds=1,10,1,7,1,10,1,7`, // Data scales
        `chxr=0,1,10,2|1,1,7,1`, // Axis ranges
        `chm=x,FF0000,1,1,20`, // score mark formatting
        `chxs=0,,16|1N**x,,16|2,,16|3,,16`, // Axis Label format
        `chxl=0:|2|4|6|8||10%2B|2:|Number+of+Drinks+Consumed|3:|Risk`, // Axis labels
        `chxp=2,50|3,50`, // Axis Label position
        `chma=0,10,10,0` // LRTB Margins, give a margin at top right for when the X is in the corner
    ]
    return <Chart title='Risks of Harm' params={data} />
}

function Chart({title, params}) {
    const url = `https://chart.googleapis.com/chart?${defaults.concat(params).join('&')}`
    return (
            <figure>
            <figcaption>{title}</figcaption>
            <img src={url} />
            </figure>
    )
}

export default Feedback
