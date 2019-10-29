import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import formatDate from 'utils/formatDate';

import { HISTORY_SIZE } from '../constants';

import styles from './history.module.scss';

const SearchHistoryComponent = props => {
    const {
        className,
        name,
        data,
        callBacks: { removeItem, clearAll }
    } = props;
    const displayData = data ? data.slice(0, HISTORY_SIZE) : null;

    return (
        <section className={cn(className, styles['history'])}>
            <header className={styles['history__header']}>
                <h2 id={`history-title-${name}`}>Search history</h2>
                <button
                    className={cn(styles['history__clear'], 'button-link')}
                    type="button"
                    onClick={clearAll}
                >
                    Clear search history
                </button>
            </header>
            {displayData ? (
                <ul
                    className={styles['history-list']}
                    role="log"
                    aria-live="polite"
                    aria-labelledby={`history-title-${name}`}
                >
                    {displayData.map(item => {
                        const dateTime = item.timestamp
                            ? new Date(item.timestamp)
                                  .toISOString()
                                  .split('.')[0]
                                  .replace(/^(.+T\d+:\d+):\d+$/, '$1')
                            : null;

                        return (
                            <li
                                key={item.timestamp}
                                className={styles['history-list__item']}
                                role="row"
                            >
                                <div
                                    className={styles['history-list__value']}
                                    role="cell"
                                >
                                    {item.value}
                                </div>{' '}
                                <time
                                    className={styles['history-list__time']}
                                    dateTime={dateTime}
                                    role="cell"
                                >
                                    {formatDate(item.timestamp)}
                                </time>{' '}
                                <button
                                    className={styles['history-list__remove']}
                                    type="button"
                                    onClick={() => removeItem(item.timestamp)}
                                >
                                    Remove
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>You have no search history.</p>
            )}
        </section>
    );
};

SearchHistoryComponent.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            timestamp: PropTypes.number
        })
    ),
    callBacks: PropTypes.shape({
        removeItem: PropTypes.func.isRequired,
        clearAll: PropTypes.func.isRequired
    }).isRequired
};

SearchHistoryComponent.defaultProps = {
    className: null,
    data: null
};

export default SearchHistoryComponent;
