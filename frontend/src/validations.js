const all = (...validators) => value => validators.every(validator => validator(value));
const present = val => !!val;
const lte = max => val => val <= max;
const gte = min => val => val >= min;

// validateInterviewer validates the whole `interviewer`
// scope for the given state.
const validateInterviewer = ({ interviewer }) => present(interviewer);

// validateBio validates the whole `bio` scope for
// the given state.
const validateBio = ({ bio }) => Object.keys(bioValidations).every(field => validateBioField(field, bio[field]));

// validateAudit validates the current `survey` scope
// for the given state.
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
        return validateInterviewer(state);
    case 'info':
        return validateBio(state);
    case 'audit':
        return validateAudit(state);
    default:
        return true;
    }
};

// validateBioField validates the given field and value
// that under the `bio` scope.
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
