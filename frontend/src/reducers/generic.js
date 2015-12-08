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

const actionValue = (_, action) => action.value
const actionFieldValue = (state, action) => on(action.field, actionValue)(state, action)
const actionType = (_, action) => action.type


export {
    on,
    actionValue,
    actionFieldValue,
    actionType
}
