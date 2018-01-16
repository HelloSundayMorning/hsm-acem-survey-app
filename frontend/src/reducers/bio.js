import { UPDATE_BIO } from 'src/constants'

const asInt = s => {
    const ns = Number(s)
    if (s === '' || isNaN(ns)) {
        return null
    } else {
        return Math.floor(ns)
    }
}

const initialState = {}

// We can't use combine reducers as:
//  1. The field to update is a parameter of the action.
//  2. We want to convert age to a number.
export default (s = initialState, a) => {
    if (a.type === UPDATE_BIO) {
        if (a.field === 'age') {
            return Object.assign({}, s, {age: asInt(a.value)})
        } else {
            return Object.assign({}, s, {[a.field]: a.value})
        }
    }
    return s
}
