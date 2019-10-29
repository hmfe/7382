import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LocalStorageDriver from 'utils/localStorageDriver';

import { HISTORY_SIZE } from '../constants';
import { selectHistory } from '../selectors';
import {
    actionSetHistory,
    actionRemoveHistoryItem,
    actionClearHistory
} from '../actions';
import SearchHistoryComponent from '../components/history';

// In such component history should persist between sessions.
// Using local storage is the best option.
// (Cookies are sent with each requests to same domain – we don't need it here; IndexedDB is an overkill).

class SearchHistoryContainer extends Component {
    constructor(props) {
        super(props);

        this.localStorageDriver = new LocalStorageDriver(props.name);

        this.saveAll = this.saveAll.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        if (this.localStorageDriver.error) return;

        // Read history from localStorage
        const localHistory = this.localStorageDriver.getItem();

        if (localHistory && !(localHistory instanceof Error)) {
            this.props.setHistory(localHistory);
        }

        // If page is refreshed, component can umnount as normal.
        window.addEventListener('beforeunload', this.saveAll);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveAll);
        this.saveAll();
    }

    saveAll() {
        const { data } = this.props;
        const dataPart =
            data && data.length ? data.slice(0, HISTORY_SIZE) : null;

        if (!this.localStorageDriver.error) {
            // Local storage has limited size, especially in mobile browsers.
            // Let's not save all we've got.
            this.localStorageDriver.setItem(dataPart);
        }
    }

    clearAll() {
        this.props.clearHistory();
    }

    removeItem(timestamp) {
        this.props.removeHistoryItem(timestamp);
    }

    render() {
        const { name, data, ...passThroughProps } = this.props;

        return (
            <SearchHistoryComponent
                {...passThroughProps}
                name={name}
                data={data}
                callBacks={{
                    clearAll: this.clearAll,
                    removeItem: this.removeItem
                }}
            />
        );
    }
}

SearchHistoryContainer.propTypes = {
    name: PropTypes.string.isRequired
};

const mapState = (state, props) => ({
    data: selectHistory(state, props.name)
});

const mapDispath = (dispatch, props) => ({
    setHistory: data => dispatch(actionSetHistory(props.name, data)),
    removeHistoryItem: timestamp =>
        dispatch(actionRemoveHistoryItem(props.name, timestamp)),
    clearHistory: () => dispatch(actionClearHistory(props.name))
});

export default connect(
    mapState,
    mapDispath
)(SearchHistoryContainer);
