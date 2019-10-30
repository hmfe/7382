import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import { connect } from 'react-redux';

import { STATUSES } from 'utils/globalConstants';
import sanitizeString from 'utils/sanitizeString';

import { TIMEOUT } from '../constants';
import { selectResult } from '../selectors';
import { actionGetResult } from '../actions';
import SearchFormComponent from '../components/form';

const DEFULT_STATE = {
    value: '',
    needSuggest: false,
    suggestItems: null,
    suggestAbortController: null
};

// No Redux for search form - it doesn't need to share state with other components
// or to keep it after the form unmounts.

class SearchFormContainer extends Component {
    constructor(props) {
        super(props);

        this.state = { ...DEFULT_STATE };

        this.getSuggestItems = debounce(this.getSuggestItems, TIMEOUT);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onSuggestHide = this.onSuggestHide.bind(this);
    }

    getSuggestItems() {
        const { value, needSuggest } = this.state;
        const { suggestApi, isSearching } = this.props;
        const preparedValue = sanitizeString(value);

        if (!preparedValue || isSearching || !needSuggest) return;

        // Setting state first, making request right next.
        // Allowing to abort request if another one occures before the current one is finished.
        this.setState({ suggestAbortController: new AbortController() }, () => {
            // The state is now updated.
            const { suggestAbortController } = this.state;

            suggestApi(preparedValue, suggestAbortController.signal)
                .then(data => {
                    this.setState({
                        suggestItems: data,
                        suggestAbortController: null
                    });
                })
                .catch(err => {
                    this.setState({
                        suggestAbortController: null
                    });

                    if (err.name === 'AbortError') return; // Most likely abort signal fired, nothing to do.

                    throw err; // In real life Error boundary conponent would take care about this.
                });
        });
    }

    onChange(e) {
        e.stopPropagation();

        const { suggestAbortController } = this.state;

        // Aborting prevous suggest request if it's in progress.
        if (suggestAbortController) suggestAbortController.abort();

        // Setting state first, trying to make request right next.
        this.setState(
            {
                value: e.target.value,
                needSuggest: true,
                suggestItems: null,
                suggestAbortController: null
            },
            this.getSuggestItems
        );
    }

    onSubmit(e, text) {
        e.stopPropagation();
        e.preventDefault();

        const { suggestAbortController } = this.state;
        const { getResult } = this.props;
        const value = text || this.state.value;

        // Aborting prevous suggest request if its in progress.
        if (suggestAbortController) suggestAbortController.abort();

        const preparedValue = sanitizeString(value);

        if (!preparedValue) return;

        // Setting state first, try to make request right next.
        this.setState(
            {
                value,
                needSuggest: false,
                suggestItems: null,
                suggestAbortController: null
            },
            () => getResult(preparedValue)
        );
    }

    onReset(e) {
        e.stopPropagation();

        this.setState({ ...DEFULT_STATE });
    }

    onSuggestHide() {
        const { suggestAbortController } = this.state;

        // Aborting prevous suggest request if its in progress.
        if (suggestAbortController) suggestAbortController.abort();

        this.setState({ suggestAbortController: null });
    }

    render() {
        const { value, suggestItems } = this.state;
        const {
            name,
            label,
            suggestLabel,
            placeholder,
            isSearching,
            ...passThroughProps
        } = this.props;

        return (
            <SearchFormComponent
                {...passThroughProps}
                name={name}
                data={{
                    label,
                    suggestLabel,
                    placeholder,
                    value,
                    suggestItems
                }}
                status={{
                    isSearching
                }}
                callBacks={{
                    onChange: this.onChange,
                    onSubmit: this.onSubmit,
                    onReset: this.onReset,
                    onSuggestHide: this.onSuggestHide
                }}
            />
        );
    }
}

SearchFormContainer.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    suggestLabel: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    suggestApi: PropTypes.func.isRequired,
    api: PropTypes.func.isRequired
};

const mapState = (state, props) => {
    const result = selectResult(state, props.name);

    return {
        isSearching: !!result && result.status === STATUSES.loading
    };
};

const mapDispatch = (dispatch, props) => ({
    getResult: value =>
        dispatch(
            actionGetResult({
                name: props.name,
                value,
                api: props.api
            })
        )
});

export default connect(
    mapState,
    mapDispatch
)(SearchFormContainer);
