import post from 'actions/survey'
import { HISTORY } from 'src/constants'

export default location => {
    if (location.pathname === 'frames') {
        return post
    } else {
        return {
            type: HISTORY,
            location
        }
    }
}
