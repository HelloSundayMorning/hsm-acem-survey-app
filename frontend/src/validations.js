// validateInterviewer validates the whole `interviewer`
// scope for the given state.
const validateInterviewer = ({ interviewer }) => !!interviewer;

const bioRequiredFields = ['age', 'gender', 'postcode'];

// validateBio validates the whole `bio` scope for
// the given state.
const validateBio = ({ bio }) => bioRequiredFields.every(field => validateBioField(field, bio[field]));

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
const validateBioField = (field, value) => {
    switch (field) {
    case 'age':
        return !!value && value >= 12 && value <= 110
    case 'gender':
    case 'postcode':
        return !!value
    default:
        return true
    }
};

export {
    validatePage,
    validateBioField
}
