import React, { useRef, useState, useEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Highlight from 'ui/highlight';

import styles from './index.module.scss';

const InputSuggest = props => {
    const {
        className,
        name,
        label,
        value,
        suggestLabel,
        suggestItems,
        disabled,
        onChange,
        onSuggestSelect,
        onSuggestHide,
        ...rest
    } = props;
    const suggestId = `inputSuggest-suggest-${name}`;
    const inputRef = useRef(null);
    const suggestRef = useRef(null);
    const suggestItemsLength = !!suggestItems ? suggestItems.length : 0;
    const hasSuggest = suggestItemsLength > 0;
    const [isSuggestVisible, toggleSuggest] = useState(hasSuggest);
    const [currentFocusedItemId, setCurrentFocusedItemId] = useState(null);
    const currentFocusedItem = useRef();
    const isSuggestExpanded = hasSuggest && isSuggestVisible && !disabled;
    const onKeyUp = e => {
        // Hides suggest on Esc button click.
        if (e.keyCode === 27 && isSuggestVisible) toggleSuggest(false);
    };
    const onInputClick = e => {
        // Needed for hiding suggest on outside click.
        e.stopPropagation();

        if (typeof rest.onInputClick === 'function') rest.onInputClick();
    };
    const onInputFocus = () => {
        if (typeof rest.onInputFocus === 'function') rest.onInputFocus();
        if (hasSuggest && !isSuggestVisible) toggleSuggest(true);
    };
    const onInputFocusIn = e => {
        // Needed for hiding suggest on outside focus.
        e.stopPropagation();

        // For input's aria-activedescendant
        currentFocusedItem.current = null;
        setCurrentFocusedItemId(null);
    };
    const onInputKeyDown = e => {
        if (typeof rest.onInputKeyDown === 'function') rest.onInputKeyDown();

        if (
            isSuggestExpanded &&
            (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40)
        ) {
            e.preventDefault();

            const suggestItemsNodes = suggestRef.current.children;
            let nextActiveItem = null;

            switch (e.keyCode) {
                case 13:
                    if (currentFocusedItem.current) {
                        onSuggestSelect(
                            e,
                            currentFocusedItem.current.textContent
                        );
                    } else {
                        onSuggestSelect(e, value);
                    }
                    return;
                case 38: {
                    if (!currentFocusedItem.current) {
                        nextActiveItem =
                            suggestItemsNodes[suggestItemsLength - 1];
                    } else if (currentFocusedItem.current.previousSibling) {
                        nextActiveItem =
                            currentFocusedItem.current.previousSibling;
                    } else if (suggestItemsLength > 1) {
                        nextActiveItem =
                            suggestItemsNodes[suggestItemsLength - 1];
                    }
                    break;
                }
                case 40: {
                    if (!currentFocusedItem.current) {
                        nextActiveItem = suggestItemsNodes[0];
                    } else if (currentFocusedItem.current.nextSibling) {
                        nextActiveItem = currentFocusedItem.current.nextSibling;
                    } else if (suggestItemsLength > 1) {
                        nextActiveItem = suggestItemsNodes[0];
                    }
                    break;
                }
                default:
            }

            // Scrolls suggest block if needed.
            if (nextActiveItem) {
                const suggestHeight = suggestRef.current.offsetHeight;
                const suggestScrollTop = suggestRef.current.scrollTop;
                const suggetVisibleAreaBottom =
                    suggestHeight + suggestScrollTop;
                const nextActiveItemHeight = nextActiveItem.offsetHeight;
                const nextActiveItemOffsetTop = nextActiveItem.offsetTop;
                const nextActiveItemBottom =
                    nextActiveItemHeight + nextActiveItemOffsetTop;

                if (
                    nextActiveItemBottom > suggetVisibleAreaBottom ||
                    nextActiveItemOffsetTop < suggestScrollTop
                ) {
                    suggestRef.current.scrollTop = nextActiveItemOffsetTop;
                }

                currentFocusedItem.current = nextActiveItem;
                setCurrentFocusedItemId(nextActiveItem.getAttribute('id'));
            }
        }
    };
    const onSuggestFocusIn = e => {
        // Needed for hiding suggest on outside focus.
        e.stopPropagation();

        currentFocusedItem.current = e.target;
        setCurrentFocusedItemId(e.target.getAttribute('id'));
    };

    useEffect(() => {
        // Updates suggest visibility only if input is focused.
        if (!isSuggestExpanded) {
            currentFocusedItem.current = null;
            setCurrentFocusedItemId(null);
        }
    }, [isSuggestExpanded]);

    useEffect(() => {
        // Updates suggest visibility only if input is focused.
        if (document.activeElement === inputRef.current) {
            toggleSuggest(hasSuggest);
        }
    }, [hasSuggest]);

    useEffect(() => {
        // Hides suggest on ouside click and focus.
        function hideSuggest(e) {
            // Sync code state updates from within React event handler are batched before rerender,
            // but here unstable_batchedUpdates is required.
            unstable_batchedUpdates(() => {
                toggleSuggest(false);
                setCurrentFocusedItemId(null);
                currentFocusedItem.current = null;
            });

            if (typeof onSuggestHide === 'function') onSuggestHide();
        }

        window.addEventListener('click', hideSuggest);
        window.addEventListener('focusin', hideSuggest);
        // Reat doesn't support focusIn so it can't be passed to element as prop.
        if (inputRef && inputRef.current) {
            inputRef.current.addEventListener('focusin', onInputFocusIn);
        }
        if (suggestRef && suggestRef.current) {
            suggestRef.current.addEventListener('focusin', onSuggestFocusIn);
        }

        return function cleanup() {
            window.removeEventListener('click', hideSuggest);
            window.removeEventListener('focusin', hideSuggest);
        };
    }, [inputRef, onSuggestHide, suggestRef]);

    return (
        <div className={cn(className, styles.input)} onKeyUp={onKeyUp}>
            <input
                ref={inputRef}
                className={styles['input__control']}
                value={value}
                disabled={disabled}
                onClick={onInputClick}
                onChange={onChange}
                onFocus={onInputFocus}
                onKeyDown={onInputKeyDown}
                {...rest}
                role="combobox"
                aria-label={label}
                aria-owns={suggestId}
                aria-controls={suggestId}
                aria-expanded={isSuggestExpanded}
                aria-haspopup="true"
                aria-autocomplete="list"
                aria-activedescendant={currentFocusedItemId}
            />
            <div className="sr-only" aria-live="assertive">
                {suggestItemsLength} suggestions found
                {suggestItemsLength
                    ? ', use up and down arrows to review'
                    : null}
            </div>
            {isSuggestExpanded && (
                <ul
                    id={suggestId}
                    ref={suggestRef}
                    className={cn(
                        styles['input__suggest'],
                        styles['input-suggest']
                    )}
                    role="listbox"
                    aria-label={suggestLabel}
                >
                    {suggestItems.map(item => {
                        const itemId = `inputSuggest-suggest-item-${item.id}-${name}`;

                        return (
                            <li
                                key={itemId}
                                id={itemId}
                                className={styles['input-suggest__item']}
                                onClick={e => onSuggestSelect(e, item.name)}
                                role="option"
                                aria-selected={currentFocusedItemId === itemId}
                            >
                                <Highlight str={item.name} value={value} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

InputSuggest.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    suggestLabel: PropTypes.string.isRequired,
    suggestItems: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            timestamp: PropTypes.number
        })
    ),
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSuggestSelect: PropTypes.func.isRequired,
    onSuggestHide: PropTypes.func
};

InputSuggest.defaultProps = {
    className: null,
    value: '',
    suggestItems: null,
    disabled: false,
    onSuggestHide: null
};

export default InputSuggest;
