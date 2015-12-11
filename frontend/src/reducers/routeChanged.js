import initialState from 'stores/initialState'

export default (state, {location: { pathname }}) => {
    if (pathname === '/') {
        // Default location is stored in the local storage, and set in
        // the select widget, but when returing back to the intro
        // screen the UPDATE_LOCATION action won't be dispatched.
        state = Object.assign({}, initialState, { location: state.location })
    }
    return state
}
