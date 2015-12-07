
function fieldAction(type) {
    return {
        type,
        action: function(value, field) {
            return {
                type,
                field,
                value
            }
        }
    }
}

export {
    fieldAction
}
