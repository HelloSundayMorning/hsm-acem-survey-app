
//////////////////////////////////////////
// Data from document attached to: https://qortex.com/theplant#groups/56496e5d8d93e31c8210ef3d/entry/56496e9b8d93e31c8210efa1/cid/56539b8f8d93e30d5e0268ab

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
    return Math.round(percentage);
}

const incidentRiskFactor = {
    0: 'unlikely', // 1 or 2
    1: 'twice as likely', // 3 or 4
    2: '3 times more likely', // 5 or 6
    3: '4-6 times more likely', // 7, 8 or 9
    4: '7 times more likely' // 10 or more
}

function surveyScore(survey) {
    return survey.map(({answer}) => answer.score).reduce((a, b) => a + b)
}

function dailyScore(survey) {
    // Q2 is index 1 (remember, 0-based!)
    let answer = survey[1]

    return !!answer ? answer.answer.score : 0
}

const LOW_RISK = 'low-risk'
const MODERATE_RISK = 'moderate-risk'
const HIGH_RISK = 'high-risk'
const DEPENDENCE_LIKELY = 'dependence-likely'

function riskCategory(surveyScore) {
    if (surveyScore <= 7) {
        return LOW_RISK
    } else if (surveyScore < 15) {
        return MODERATE_RISK
    } else if (surveyScore < 20) {
        return HIGH_RISK
    } else {
        return DEPENDENCE_LIKELY
    }

}

const surveyAggregates = {
    average: 10, // FIXME what's the real value for this?
    max: 40,
    recommended: 7 // FIXME double check this
}

export {
    drinkPercentage,
    surveyAggregates,
    surveyScore,
    dailyScore,
    riskCategory,
    incidentRiskFactor,
    LOW_RISK,
    MODERATE_RISK,
    HIGH_RISK,
    DEPENDENCE_LIKELY
}
