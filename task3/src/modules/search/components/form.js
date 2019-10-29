import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import InputSuggest from 'ui/inputSuggest';

import styles from './form.module.scss';

const SearchFormComponent = props => {
    const {
        className,
        name,
        data: { label, placeholder, value, suggestLabel, suggestItems },
        status: { isSearching },
        callBacks: { onChange, onSubmit, onReset, onSuggestHide }
    } = props;
    const hasValue = value.trim().length > 0;

    return (
        <form
            className={cn(className, styles.searchForm)}
            onSubmit={onSubmit}
            onReset={onReset}
        >
            <InputSuggest
                name={name}
                className={styles['searchForm__control']}
                type="text"
                label={label}
                placeholder={placeholder}
                value={value}
                suggestLabel={suggestLabel}
                suggestItems={suggestItems}
                disabled={isSearching}
                onChange={onChange}
                onSuggestSelect={onSubmit}
                onSuggestHide={onSuggestHide}
            />
            {hasValue && (
                <button
                    className={styles['searchForm__reset']}
                    type="reset"
                    disabled={isSearching}
                >
                    Reset
                </button>
            )}
            <button
                className={cn(
                    styles['searchForm__submit'],
                    isSearching && styles['searchForm__submit_progress']
                )}
                type="submit"
                disabled={isSearching}
            >
                Search
            </button>
        </form>
    );
};

SearchFormComponent.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    data: PropTypes.shape({
        value: PropTypes.string,
        suggestItems: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                suggestLabel: PropTypes.string,
                placeholder: PropTypes.string,
                value: PropTypes.string,
                timestamp: PropTypes.number
            })
        )
    }).isRequired,
    status: PropTypes.shape({
        isSearching: PropTypes.bool
    }).isRequired,
    callBacks: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        onSuggestHide: PropTypes.func.isRequired
    }).isRequired
};

SearchFormComponent.defaultProps = {
    className: null
};

export default SearchFormComponent;
