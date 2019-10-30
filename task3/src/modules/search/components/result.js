import React from 'react';
import PropTypes from 'prop-types';

import { STATUSES } from 'utils/globalConstants';

const SearchResultComponent = props => {
    const { className, result } = props;

    if (!result || !result.status) return null;

    const { status, data } = result;
    let errorMessage = null;

    if (status === STATUSES.failed) {
        errorMessage = 'An error occured. Please try again.';
    }

    if (!errorMessage && !data) return null;

    return (
        <section
            className={className}
            aria-live="polite"
            aria-atomic="true"
            aria-busy={status === STATUSES.loading}
        >
            <header>
                <h2>Search result</h2>
            </header>
            {errorMessage || data.message ? (
                <p>{errorMessage || data.message}</p>
            ) : (
                <>
                    <h3>{data.name}</h3>
                    {!!data.description && (
                        <p>
                            <b>Description</b>: {data.description}
                        </p>
                    )}
                    {!!data.temperament && (
                        <p>
                            <b>Temperament</b>: {data.temperament}.
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

SearchResultComponent.propTypes = {
    className: PropTypes.string,
    result: PropTypes.shape({
        status: PropTypes.string,
        data: PropTypes.shape({
            name: PropTypes.string,
            description: PropTypes.string,
            temperament: PropTypes.string,
            message: PropTypes.string
        })
    }),
    status: PropTypes.oneOf(Object.keys(STATUSES).map(item => STATUSES[item]))
};

SearchResultComponent.defaultProps = {
    className: null,
    result: null,
    status: null
};

export default SearchResultComponent;
