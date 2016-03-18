// bioValidates validates the given field and value
// that under the `bio` scope.
const bioValidates = (field, value) => {
    switch (field) {
    case 'age':
        return !!value && value >= 12 && value <= 110
    case 'gender':
    case 'postcode':
        return !!value
    default:
        return true
    }
}

export {
    bioValidates
}
