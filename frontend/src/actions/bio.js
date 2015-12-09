import { fieldAction } from 'actions/generic'

const interviewer = fieldAction('SET_INTERVIEWER');
const bio = fieldAction('UPDATE_BIO')
const location = fieldAction('UPDATE_LOCATION')

export {
    interviewer,
    bio,
    location
}
