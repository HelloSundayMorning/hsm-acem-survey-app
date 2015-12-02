function on(field, reducer) {
    return (state, action) => {
        const oldState = state[field]
        const newState = reducer(oldState, action)
        if (oldState === newState) {
            return state
        } else {
            return Object.assign({}, state, { [field]: newState })
        }
    }
}

export {
    on
}
