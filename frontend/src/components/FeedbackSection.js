import React from 'react'

const Message = ({ message }) => {
    if (message) {
        return <div id='feedback-message'>{message}</div>
    } else {
        return <div></div>
    }
}

const FeedbackSection = ({ message, onPost }) =>
    <div id='feedback-section'>
        <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={onPost}>SEND FEEDBACK</button>
        <Message message={message} />
    </div>

FeedbackSection.PropTypes = {
    message: React.PropTypes.string,
    onPost: React.PropTypes.func.isRequired
}

export default FeedbackSection
