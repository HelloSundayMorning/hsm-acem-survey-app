const all = (...validators) => value => validators.every(validator => validator(value));
const present = val => !!val;
const lte = max => val => val <= max;
const gte = min => val => val >= min;
const pluck = field => value => value[field];


//const resultScore = field => reduce((a, b) => a + b)

// This is the reverse of compose (`.`) from maths and functional languages:
// => compose(a, b)(value) = b(a(value))
// but usually a . b = a(b(value))
const compose = (...functions) => value => functions.reduce((val, fn) => fn(val), value)

// has('bio')
// -> compose(pluck('bio'), present)
// -> value => present(value.bio)
const has = field => compose(pluck(field), present)

// '/' requires an answer for the interviewer question
const validateFront = has('interviewer')

// '/feedback' requires an answer for the evaluation question
//const validateFeedback = has('evaluation')

const validateFeedback = ({ survey, evaluation }) => {
    // //let questionIndexes = [];
    let questionScores = 0;
    for (var item of survey) {
       questionScores += item.answer.score;
    }
    // if the score is smaller than 7 return true
    if (questionScores <= 7) {
      return true;
    }
    return !(evaluation === null );
};
// '/info' requires `bio` be valid
const validateInfo = ({ bio }) => Object.keys(bioValidations).every(field => validateBioField(field, bio[field]));

// '/audit' requires the survey be valid
const validateAudit = ({ survey, lastQuestion }) => {
    let questionIndexes = [];
    for (let i = 0; i <= lastQuestion; ++i) {
        questionIndexes.push(i);
    }
    return questionIndexes.every(i => survey[i] && survey[i].answer);
};

// validatePage validates the given page's state.
// page: '/' | 'info' | 'audit' | 'feedback' | 'frames' (see `pageOrder` in src/components/Main)
const validatePage = (page, state = {}) => {
    switch (page) {
    case '/':
        return validateFront(state)
    case 'info':
        return validateInfo(state);
    case 'audit':
        return validateAudit(state);
    case 'feedback':
        return validateFeedback(state)
    default:
        return true;
    }
};

// validateBioField validates the given field and value
// in the `bio`.
const validateBioField = (field, value) => bioValidations[field] ? bioValidations[field](value) : true;

const bioValidations = {
    age: all(present, gte(12), lte(110)),
    gender: present,
    postcode: present
};

export {
    validatePage,
    validateBioField
}
