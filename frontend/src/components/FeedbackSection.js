import React from 'react'
import PoorSnackbar from 'components/PoorSnackbar'

const Message = ({ message }) => {
    if (message) {
        return <PoorSnackbar text={message} />
    } else {
        return <div></div>
    }
}

class FeedbackSection extends React.Component {
    constructor(props) {
        super(props)
        this.onButtonClick = this.onButtonClick.bind(this)
    }

    onButtonClick() {
        const freeText = window.prompt('Enter feedback')
        if (freeText) {
            this.props.onPost(freeText)
        }
    }

    render() {
        return (
            <div id='feedback-section'>
                <button className='mdl-button mdl-button--raised mdl-button--colored' onClick={this.onButtonClick}>Feedback</button>
                <Message message={this.props.message} />
            </div>
        )
    }
}

FeedbackSection.PropTypes = {
    message: React.PropTypes.string,
    onPost: React.PropTypes.func.isRequired
}

export default FeedbackSection
