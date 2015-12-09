function emptyComponent() {
    return {
        render: () => null
    }
}


const debugPanel = {
    component: emptyComponent,
    storeMiddleware: middleware => middleware
}

export {
    debugPanel
}
