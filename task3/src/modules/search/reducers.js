import { combineReducers } from 'redux';

import { STATUSES } from 'utils/globalConstants';

import { ACTION_TYPES } from './constants';

function result(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.getResult: {
            const { name } = action;
            const prevData = state[name];

            return {
                ...state,
                [name]: {
                    status: STATUSES.loading,
                    data: prevData ? prevData.data : null
                }
            };
        }
        case ACTION_TYPES.getResultSuccess: {
            const { name, data } = action;

            return {
                ...state,
                [name]: {
                    status: STATUSES.loaded,
                    data: data
                }
            };
        }
        case ACTION_TYPES.getResultFail: {
            const { name } = action;
            const prevData = state[name];

            return {
                ...state,
                [name]: {
                    status: STATUSES.failed,
                    data: prevData ? prevData.data : null
                }
            };
        }
        default:
            return state;
    }
}

function history(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.setHistory: {
            const { name, data } = action;

            return {
                ...state,
                [name]: data
            };
        }
        case ACTION_TYPES.addHistoryItem: {
            const { name, data } = action;
            const history = state[name] || [];

            return {
                ...state,
                [name]: [data].concat(history)
            };
        }
        case ACTION_TYPES.removeHistoryItem: {
            const { name, timestamp } = action;
            const history = state[name].slice();
            const newState = { ...state };

            history.some((item, index) => {
                if (item.timestamp === timestamp) {
                    history.splice(index, 1);
                    return true;
                }

                return false;
            }, history);

            if (!history.length) {
                delete newState[name];
            } else {
                newState[name] = history;
            }

            return newState;
        }
        case ACTION_TYPES.clearHistory: {
            const newState = { ...state };

            delete newState[action.name];

            return newState;
        }
        default:
            return state;
    }
}

export default combineReducers({
    result,
    history
});
