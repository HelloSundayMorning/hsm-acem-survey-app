/*eslint-env node, mocha */
/*global expect */
/*eslint no-console: 0*/

import * as bio from 'actions/bio'
//import * as email from 'actions/email' // email not pure actions
import history from 'actions/history'
//import * as survey from 'actions/survey' // survey not pure action
import { answer } from 'actions/survey'

import reducer from 'reducers/index'

import initialState from 'stores/initialState'

const tests = [{
    input: {},
    action: bio.interviewer.action('Nurse'),
    expected: { interviewer: 'Nurse' }
},{
    input: {},
    action: bio.location.action('Fitzroy'),
    expected: { location: 'Fitzroy' }
},{
    input: {},
    action: bio.bio.action('30', 'age'),
    expected: { bio: { age: 30 }}
},{
    input: { bio: { age: 20 }},
    action: bio.bio.action('30', 'age'),
    expected: { bio: { age: 30 }}
},{
    input: {},
    action: bio.bio.action('abc', 'age'),
    expected: { bio: { age: null }}
},{
    input: { bio: { age: 20 }},
    action: bio.bio.action('abc', 'age'),
    expected: { bio: { age: null }}
},{
    input: { location: '123' },
    action: history({ pathname: '/' }),
    expected: Object.assign({}, initialState, { location: '123' })
    // `history` is not pure, can trigger posting of survey
    // },{
    //       input: {},
    //       action: history({location: { pathname: 'feedback' }})
    //       expected: { history: { location: '' }}
}];

// test strip later answers
// test fill holes with null
// test set last question
const question = { text: 'question', answers: [
    {text: 'Monthly', score: 0 },
    {text: 'Always', score: 4}
]}

const surveyState = { bio: { gender: 'male' }, survey: [] };

tests.push({
    input: surveyState,
    action: answer(0, question, question.answers[0]),
    expected: { survey: [{ question: question.text, answer: question.answers[0] }], lastQuestion: 0 }
});

tests.push({
    label: 'set last question',
    input: surveyState,
    action: answer(0, question, question.answers[1]),
    expected: { survey: [{ question: question.text, answer: question.answers[1] }], lastQuestion: 2 }
});

describe('reducer', () => {
    tests.forEach(({ label, input, action, expected }) => {
        it('should ' + (label ? label : `transform ${JSON.stringify(input)} to ${JSON.stringify(expected)} on action ${JSON.stringify(action)}`), () => {
            const result = reducer(input, action);
            expect(result).to.containSubset(expected);
        });
    });
});
