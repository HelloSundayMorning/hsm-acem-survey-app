import post from 'actions/survey'

const type = 'HISTORY'

export default location => {
    if (location.pathname === 'feedback') {
        return post
    } else {
        return {
            type,
            location
        }
    }
}

export {
    type
}
