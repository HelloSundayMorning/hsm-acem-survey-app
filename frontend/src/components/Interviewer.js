import React from 'react'
import { connect } from 'react-redux';
import { interviewer } from 'actions/bio'
import Question from 'components/Question'

var interviewerQuestion = {
    text: 'Interviewer',
    key: 'interviewer',
    answers: [
        {key: 'nurse', text: 'Nurse'},
        {key: 'doctor', text: 'Doctor'},
        {key: 'allied', text: 'Allied Health'},
        {key: 'other', text: 'Other'}
    ]
}

var Interviewer = ({ interviewer, update }) => <Question
                               value={interviewer}
                               onChange={input => update(input.value)}
                               q={interviewerQuestion} />;

export default connect(
    ({ interviewer }) => ({ interviewer }),
    {update: interviewer.action}
)(Interviewer);
