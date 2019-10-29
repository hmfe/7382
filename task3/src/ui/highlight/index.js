import React from 'react';

const Highlight = props => {
    const { str, value } = props;

    if (!str || typeof str !== 'string') return null;
    if (!value || typeof value !== 'string') return str;

    const expr = new RegExp(value, 'i'); // Search in any part of string
    const result = str.match(expr);

    if (!result) return str;

    const start = str.slice(0, result.index);
    const found = result[0];
    const end = str.slice(result.index + value.length);

    return (
        <>
            {start}
            <b>{found}</b>
            {end}
        </>
    );
};

export default Highlight;
