import React from 'react'
import Question from 'components/Question'

import standardDrinkReferenceWide from 'src/images/Standard_Drinks.png'
import standardDrinkReferenceTall from 'src/images/Standard_Drinks_2.png'

const AuditPage = ({ survey, lastQuestion, update }) => {
    const change = i =>
        (event, question, answer) => {
            update(i, question, answer)
        }

    return (
        <section id='audit'>
            <h1>Audit Questionnaire</h1>
            <div id='drink-reference'>
                <img id='wide' src={standardDrinkReferenceWide} />
                <img id='tall' src={standardDrinkReferenceTall} />
                Source: <a href='http://www.druginfo.sl.nsw.gov.au/alcohol/know_your_standards.html'>NSW Health</a>
            </div>
            {auditQuestions.map((q, i) =>
                <Question key={q.key || q.text} q={q} onChange={change(i)} value={(survey[i] || {answer: {}}).answer.text} disabled={i > lastQuestion} />
            )}
        </section>
    );
}

export default AuditPage

const auditQuestions = [
    {
        'text': 'Q1: How often do you have a drink containing alcohol?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Monthly or less', score: 1},
            {'text': '2-4 times a month', score: 2},
            {'text': '2-3 times a week', score: 3},
            {'text': '4 or more times a week', score: 4}]
    },{
        'text': 'Q2: How many standard drinks containing alcohol do you have in a typical day when you are drinking?',
        'answers': [
            {'text': '1 or 2', score: 0},
            {'text': '3 or 4', score: 1},
            {'text': '5 or 6', score: 2},
            {'text': '7, 8 or 9', score: 3},
            {'text': '10 or more', score: 4}]
    },{
        'text': 'Q3: How often do you have six or more drinks on one occasion?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Monthly or less', score: 1},
            {'text': '2-4 times a month', score: 2},
            {'text': '2-3 times a week', score: 3},
            {'text': '4 or more times a week', score: 4}]
    },{
        'text': 'Q4: How often during the last year have you found that you were not able to stop drinking once you had started?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Less than monthly', score: 1},
            {'text': 'Monthly', score: 2},
            {'text': 'Weekly', score: 3},
            {'text': 'Daily or almost daily', score: 4}]
    },{
        'text': 'Q5: How often in the last year have you failed to do what was normally expected from you because of drinking?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Less than monthly', score: 1},
            {'text': 'Monthly', score: 2},
            {'text': 'Weekly', score: 3},
            {'text': 'Daily or almost daily', score: 4}]
    },{
        'text': 'Q6: How often in the last year have you needed a first drink in the morning to get yourself going after a night of drinking?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Less than monthly', score: 1},
            {'text': 'Monthly', score: 2},
            {'text': 'Weekly', score: 3},
            {'text': 'Daily or almost daily', score: 4}]
    },{
        'text': 'Q7: How often in the last year have you had a feeling of guilt or remorse after drinking?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Less than monthly', score: 1},
            {'text': 'Monthly', score: 2},
            {'text': 'Weekly', score: 3},
            {'text': 'Daily or almost daily', score: 4}]
    },{
        'text': 'Q8: How often in the last year have you been unable to remember what happened the night before because you had been drinking?',
        'answers': [
            {'text': 'Never', score: 0},
            {'text': 'Less than monthly', score: 1},
            {'text': 'Monthly', score: 2},
            {'text': 'Weekly', score: 3},
            {'text': 'Daily or almost daily', score: 4}]
    },{
        'text': 'Q9: Have you or someone else been injured as a result of your drinking?',
        'answers': [
            {'text': 'No', score: 0},
            {'text': 'Yes, but not in the last year', score: 2},
            {'text': 'Yes, during the last year', score: 4}]
    },{
        'text': 'Q10: Has a relative or friend, or a doctor or another health worker been concerned about your drinking or suggested you cut down?',
        'answers': [
            {'text': 'No', score: 0},
            {'text': 'Yes, but not in the last year', score: 2},
            {'text': 'Yes, during the last year', score: 4}]
    }]
