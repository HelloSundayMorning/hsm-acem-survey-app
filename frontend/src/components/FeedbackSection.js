import React from 'react'
import {
    FEEDBACK_POSTING,
    FEEDBACK_POSTED,
    FEEDBACK_POST_FAILED
} from 'src/constants'

const messageMap = {
    [FEEDBACK_POSTING]: 'Sending feedback…',
    [FEEDBACK_POSTED]: 'Feedback sent.',
    [FEEDBACK_POST_FAILED]: 'Failed to send feedback.'
};

const SendingStatus = ({ status }) => {
    if (status) {
        return <div id='feedback-message'>{messageMap[status]}</div>;
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
