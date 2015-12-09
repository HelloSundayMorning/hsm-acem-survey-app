import initialState from 'stores/initialState'

export default (state, {location: { pathname }}) => {
    if (pathname === '/') {
        state = initialState
    }
    return state
}
