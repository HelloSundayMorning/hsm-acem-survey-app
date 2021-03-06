export default updateSurvey

function updateSurvey(state, { index, question, answer }) {
    const { survey: oldSurvey, bio: { gender } } = state;
    const survey = []

    // Don't use slice, as it doesn't play nice with arrays with holes
    for (let i = 0; i < 10; ++i) {
        survey[i] = oldSurvey[i]
    }

    survey[index] = {
        question: question.text,
        answer
    }

    const last = lastQuestion(survey, gender);

    return Object.assign(
        {},
        state,
        {
            survey: stripLaterQuestions(survey, last),
            lastQuestion: last
        })
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
        return 0 // Q1
    } else if (q2 + q3 === 0) {
        return 2 // Q3
    } else {
        return q1 + q2 + q3 >= cutoff ? 9 : 2 // Q3 or Q10
    }
}
