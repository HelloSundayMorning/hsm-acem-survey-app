export default updateSurvey

function updateSurvey({ survey: oldSurvey, bio: { gender } }, { index, question, answer }) {
    let survey = []

    // Don't use slice, as it doesn't play nice with arrays with holes
    for (let i = 0; i < 10; ++i) {
        survey[i] = oldSurvey[i]
    }

    survey[index] = {
        question: question.text,
        answer
    }

    let last = lastQuestion(survey, gender)
    survey = stripLaterQuestions(survey, last)

    return { survey: stripLaterQuestions(survey, last), lastQuestion: last }
}

function stripLaterQuestions(survey, lastQuestion) {
    return survey.slice(0, lastQuestion + 1)
}

function lastQuestion(survey, gender) {
    const q1 = (!!survey[0] && survey[0].answer.score) || 0
    const q2 = (!!survey[1] && survey[1].answer.score) || 0
    const q3 = (!!survey[2] && survey[2].answer.score) || 0

    const cutoff = { 'male': 4, 'female': 3, 'other': 3}[gender]

    if (q1 == 0) {
        return 0
    } else if (q2 + q3 === 0) {
        return 2
    } else {
        return q1 + q2 + q3 >= cutoff ? 10 : 2
    }
}
