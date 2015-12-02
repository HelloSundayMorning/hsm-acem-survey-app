function setField(field) {
    return (state, { value }) => {
        if (state[field] == value) {
            return state
        } else {
            return Object.assign({}, state, { [field]: value })
        }
    }
}

export {
    setField
}
