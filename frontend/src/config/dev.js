import React from 'react'
import { compose } from 'redux';
import * as ReduxDev from 'redux-devtools/lib/react'
import { devTools } from 'redux-devtools'

function debugPanelComponent({ store }) {
    return (
        <ReduxDev.DebugPanel top right bottom>
            <ReduxDev.DevTools store={store} monitor={ReduxDev.LogMonitor} />
        </ReduxDev.DebugPanel>
    )
}

function storeMiddleware(middleware) {
    return compose(middleware, devTools())
}

const debugPanel = {
    component: debugPanelComponent,
    storeMiddleware
}

const apiRoot = 'http://localhost:8000'

export {
    debugPanel,
    apiRoot
}
