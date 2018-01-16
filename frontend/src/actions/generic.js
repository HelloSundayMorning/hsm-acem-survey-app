
function fieldAction(type) {
    return {
        type,
        action: (value, field) => ({
            type,
            field,
            value
        })
    }
}

export {
    fieldAction
}
