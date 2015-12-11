import { on, actionFieldValue } from 'reducers/generic'

const ageReducer = on('age', (s, a) => asInt(a.value))

const asInt = s => {
    const ns = Number(s)
    if (s === '' || isNaN(ns)) {
        return null
    } else {
        return Math.floor(ns)
    }
}

export default (s, a) => {
    if (a.field === 'age') {
        return ageReducer(s, a)
    } else {
        return actionFieldValue(s, a)
    }
}
