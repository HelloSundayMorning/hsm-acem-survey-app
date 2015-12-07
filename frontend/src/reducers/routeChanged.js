import initialState from 'stores/initialState'

export default (state, action) => {
    if (action.location.pathname === '/') {
        state = initialState
    }
    return state
}
