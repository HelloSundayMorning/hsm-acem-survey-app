import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { debugPanel } from 'config'
import reducer from 'reducers'

const create = initialState => debugPanel.storeMiddleware(applyMiddleware(thunk))(createStore)(reducer, initialState)

export {
    create
}
