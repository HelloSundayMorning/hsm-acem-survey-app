import {
    FEEDBACK_POSTING,
    FEEDBACK_POSTED,
    FEEDBACK_POST_FAILED
} from 'src/constants'

export default (state = null, action) => {
    switch (action.type) {
    case FEEDBACK_POSTING:
    case FEEDBACK_POSTED:
    case FEEDBACK_POST_FAILED:
        return action.message
    default:
        return state
    }
}
