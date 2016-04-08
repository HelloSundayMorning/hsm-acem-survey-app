/*eslint-env node, mocha */
/*global expect:false*/

import {
    validatePage,
    validateBioField
} from 'src/validations';

const runTestCases = (testCasesByName, testMethod) => {
    describe(testMethod.name, () => {
        for (let name in testCasesByName) {
            const { label, testCases } = testCasesByName[name];
            it(label, () => {
                for (let index in testCases) {
                    const { input, expected } = testCases[index];
                    expect(testMethod(name, input)).to.equal(expected);
                }
            });
        }
    });
};

const noValidationPage = page => ({
    label: `no validation in ${JSON.stringify(page)} page`,
    testCases: [{ input: {}, expected: true }]
});

const pages = {
    '/': {
        label: 'interviewer must be present in "/" page',
        testCases: [
            { input: {}, expected: false },
            { input: { interviewer: null }, expected: false },
            { input: { interviewer: 'nurse' }, expected: true }
        ]
    },
    'info': {
        label: 'bio required fields must be present and valid in "info" page',
        testCases: [
            { input: { bio: {} }, expected: false },
            { input: { bio: { 'age': 12 } }, expected: false },
            { input: { bio: { 'age': 12, 'gender': 'male' } }, expected: false },
            { input: { bio: { 'age': 12, 'gender': 'male', 'postcode': '310001' } }, expected: true },
            { input: { bio: { 'email': 'person@email.com' } }, expected: false }
        ]
    },
    'audit': {
        label: 'every questions must be answered in "audit" page',
        testCases: [
            { input: { survey:[], lastQuestion: 0 }, expected: false },
            { input: { survey:[{ question: 'Q', answer: null }], lastQuestion: 0 }, expected: false },
            { input: { survey:[{ question: 'Q', answer: 'A' }], lastQuestion: 0 }, expected: true },
            { input: { survey:[{ question: 'Q', answer: 'A' }], lastQuestion: 1 }, expected: false }
        ]
    },
    'feedback': {
        label: 'evaluation question must be answered',
        testCases: [
            { input: {}, expected: false },
            { input: { evaluation: 'yes' }, expected: true }
        ]},
    'frames': noValidationPage('frames')
};

runTestCases(pages, validatePage);

const genericField = (field, value, required) => ({
    label: required ? `${field} must be present` : `${field} is optional`,
    testCases: [
        { input: value, expected: true },
        { input: '', expected: !required },
        { input: null, expected: !required },
        { input: undefined, expected: !required }
    ]
});
const optionalField = (field, value) => genericField(field, value, false);
const requiredField = (field, value) => genericField(field, value, true);

const bioFields = {
    'age': {
        label: 'age must between 12 and 110',
        testCases: [
            { input: 12, expected: true },
            { input: 65, expected: true },
            { input: 110, expected: true },
            { input: 11, expected: false },
            { input: 11, expected: false },
            { input: 111, expected: false }
        ]
    },
    'gender': requiredField('gender', 'male'),
    'postcode': requiredField('postcode', '310001'),
    'email': optionalField('email', 'person@example.com'),
    'phone': optionalField('phone', '+86020-84429400'),
    'unknown': optionalField('unknown', 'whatever')
};

runTestCases(bioFields, validateBioField);
