import { ACTION_TYPES } from './constants';

export const actionGetResult = data => ({
    type: ACTION_TYPES.getResult,
    name: data.name,
    value: data.value,
    api: data.api
});

export const actionGetResultSuccess = (name, data) => ({
    type: ACTION_TYPES.getResultSuccess,
    name,
    data
});

export const actionGetResultFail = name => ({
    type: ACTION_TYPES.getResultFail,
    name
});

export const actionSetHistory = (name, data) => ({
    type: ACTION_TYPES.setHistory,
    name,
    data
});

export const actionAddHistoryItem = (name, data) => ({
    type: ACTION_TYPES.addHistoryItem,
    name,
    data
});

export const actionRemoveHistoryItem = (name, timestamp) => ({
    type: ACTION_TYPES.removeHistoryItem,
    name,
    timestamp
});

export const actionClearHistory = name => ({
    type: ACTION_TYPES.clearHistory,
    name
});
