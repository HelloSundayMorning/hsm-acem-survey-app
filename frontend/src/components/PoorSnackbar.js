import React from 'react'
import EmptyComponent from 'components/EmptyComponent'

const PoorSnackbar = ({ text }) => (
    <div className='poor-snack'>
        {text}
    </div>
);

const StatusBar = textMap => ({ status }) => {
    if (status === null) {
        return <EmptyComponent />
    } else {
        return <PoorSnackbar text={textMap[status]} />
    }
}

export default PoorSnackbar

export {
    StatusBar
}
