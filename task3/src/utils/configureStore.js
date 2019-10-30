import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import {
    reducers as searchReducers,
    sagas as searchSagas
} from 'modules/search';

const sagaMiddleware = createSagaMiddleware();
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const reducers = combineReducers({
    search: searchReducers
});

function configureStore() {
    const store = createStore(
        reducers,
        composeEnhancers(applyMiddleware(sagaMiddleware))
    );

    sagaMiddleware.run(searchSagas.getResult);

    return store;
}

export default configureStore;
