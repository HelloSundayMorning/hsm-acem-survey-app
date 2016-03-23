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
                    const { input, valid } = testCases[index];
                    expect(testMethod(name, input)).to.equal(valid);
                }
            });
        }
    });
};

const noValidationPage = page => ({
    label: `no validation in ${JSON.stringify(page)} page`,
    testCases: [{ input: {}, valid: true }]
});

const pages = {
    '/': {
        label: 'interviewer must be present in "/" page',
        testCases: [
            { input: {}, valid: false },
            { input: { interviewer: null }, valid: false },
            { input: { interviewer: 'nurse' }, valid: true }
        ]
    },
    'info': {
        label: 'bio required fields must be present and valid in "info" page',
        testCases: [
            { input: { bio: {} }, valid: false },
            { input: { bio: { 'age': 12 } }, valid: false },
            { input: { bio: { 'age': 12, 'gender': 'male' } }, valid: false },
            { input: { bio: { 'age': 12, 'gender': 'male', 'postcode': '310001' } }, valid: true },
            { input: { bio: { 'email': 'person@email.com' } }, valid: false }
        ]
    },
    'audit': {
        label: 'every questions must be answered in "audit" page',
        testCases: [
            { input: { survey:[], lastQuestion: 0 }, valid: false },
            { input: { survey:[{ question: 'Q', answer: null }], lastQuestion: 0 }, valid: false },
            { input: { survey:[{ question: 'Q', answer: 'A' }], lastQuestion: 0 }, valid: true },
            { input: { survey:[{ question: 'Q', answer: 'A' }], lastQuestion: 1 }, valid: false }
        ]
    }
};
pages['feedback'] = noValidationPage('feedback');
pages['frames'] = noValidationPage('frames');

runTestCases(pages, validatePage);

const genericField = (field, value, required) => ({
    label: required ? `${field} must be present` : `${field} is optional`,
    testCases: [
        { input: value, valid: true },
        { input: '', valid: !required },
        { input: null, valid: !required },
        { input: undefined, valid: !required }
    ]
});
const optionalField = (field, value) => genericField(field, value, false);
const requiredField = (field, value) => genericField(field, value, true);

const bioFields = {
    'age': {
        label: 'age must between 12 and 110',
        testCases: [
            { input: 12, valid: true },
            { input: 65, valid: true },
            { input: 110, valid: true },
            { input: 11, valid: false },
            { input: 11, valid: false },
            { input: 111, valid: false }
        ]
    }
};
bioFields['gender'] = requiredField('gender', 'male');
bioFields['postcode'] = requiredField('postcode', '310001');
bioFields['email'] = optionalField('email', 'person@example.com');
bioFields['phone'] = optionalField('phone', '+86020-84429400');
bioFields['unknown'] = optionalField('unknown', 'whatever');

runTestCases(bioFields, validateBioField);
