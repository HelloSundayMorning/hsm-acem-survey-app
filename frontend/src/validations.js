// validatesInterviewer validates the whole `interviewer`
// scope for the given state.
const validatesInterviewer = ({ interviewer }) => !!interviewer;

// validatesBio validates the whole `bio` scope for
// the given state.
const validatesBio = ({ bio }) => Object.keys(bio).every(field => bioValidates(field, bio[field]));

// validatesBio validates the current `survey` scope
// for the given state.
const validatesAudit = ({ survey, lastQuestion }) => {
    let questionIndexes = [];
    for (let i = 0; i <= lastQuestion; ++i) {
        questionIndexes.push(i);
    }
    return questionIndexes.every(i => survey[i] && survey[i].answer);
};

// pageValidates validates the given page's state.
// page: '/' | 'info' | 'audit' | 'feedback' | 'frames' (see `pageOrder` in src/components/Main)
const pageValidates = (page, state = {}) => {
    switch (page) {
    case '/':
        return validatesInterviewer(state);
    case 'info':
        return validatesBio(state);
    case 'audit':
        return validatesAudit(state);
    default:
        return true;
    }
};

// bioValidates validates the given field and value
// that under the `bio` scope.
const bioValidates = (field, value) => {
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
    pageValidates,
    bioValidates
}
