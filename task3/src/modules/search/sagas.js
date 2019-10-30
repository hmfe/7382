import { call, put, takeEvery } from 'redux-saga/effects';

import { ACTION_TYPES } from './constants';
import {
    actionGetResultSuccess,
    actionGetResultFail,
    actionAddHistoryItem
} from './actions';

function* fetchGetResult(action) {
    const { name, value, api } = action;
    let data;

    yield put(
        actionAddHistoryItem(name, {
            value,
            timestamp: new Date().getTime()
        })
    );

    try {
        data = yield call(api, value);
    } catch (err) {
        // Here we should log error to Sentry on any other monitoring tool.
        yield put(actionGetResultFail(name));

        return;
    }

    yield put(actionGetResultSuccess(name, data));
}

function* getResult() {
    yield takeEvery(ACTION_TYPES.getResult, fetchGetResult);
}

export { getResult };
