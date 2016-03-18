import React from 'react'
import {
    FEEDBACK_POSTING,
    FEEDBACK_POST_FAILED
} from 'src/constants'

const SendingStatus = ({ status }) => {
    if (status) {
        let text = '';
        if (status === FEEDBACK_POSTING) {
            text = 'Sending feedback…';
        } else if (status === FEEDBACK_POST_FAILED) {
            text = 'Failed to send feedback.';
        } else {
            text = 'Feedback sent.';
        }
        return <div id='feedback-message'>{text}</div>;
    } else {
        return <div></div>;
    }
}

const FeedbackSection = ({ status, onPost }) =>
    <div id='feedback-section'>
        <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={onPost}>SEND FEEDBACK</button>
        <SendingStatus status={status} />
    </div>

FeedbackSection.PropTypes = {
    status: React.PropTypes.string,
    onPost: React.PropTypes.func.isRequired
}

export default FeedbackSection
