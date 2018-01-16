import { fieldAction } from 'actions/generic'
import {
    SET_INTERVIEWER,
    UPDATE_BIO,
    UPDATE_LOCATION,
    UPDATE_EVALUATION
} from 'src/constants'

const interviewer = fieldAction(SET_INTERVIEWER)
const bio = fieldAction(UPDATE_BIO)
const location = fieldAction(UPDATE_LOCATION)
const evaluate = fieldAction(UPDATE_EVALUATION)

export {
    interviewer,
    bio,
    location,
    evaluate
}
