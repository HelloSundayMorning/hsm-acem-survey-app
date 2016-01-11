import { fieldAction } from 'actions/generic'
import { SET_INTERVIEWER, UPDATE_BIO, UPDATE_LOCATION } from 'src/constants'

const interviewer = fieldAction(SET_INTERVIEWER)
const bio = fieldAction(UPDATE_BIO)
const location = fieldAction(UPDATE_LOCATION)

export {
    interviewer,
    bio,
    location
}
