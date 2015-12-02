import { fieldAction } from 'actions/generic'

const interviewer = fieldAction('SET_INTERVIEWER');
const bio = fieldAction('UPDATE_BIO')

export {
    interviewer,
    bio
}
