export const selectResult = (state, name) => {
    try {
        return state.search.result[name] || null;
    } catch (err) {
        return null;
    }
};

export const selectHistory = (state, name) => {
    try {
        return state.search.history[name] || null;
    } catch (err) {
        return null;
    }
};
