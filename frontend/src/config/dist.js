import emptyComponent from 'components/EmptyComponent'

const debugPanel = {
    component: emptyComponent,
    storeMiddleware: middleware => middleware
}

const apiRoot = 'https://screener.waldenhealth.co'

export {
    debugPanel,
    apiRoot
}
