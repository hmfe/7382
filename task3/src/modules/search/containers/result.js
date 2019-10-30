import { connect } from 'react-redux';

import { selectResult } from '../selectors';

import SearchResultComponent from '../components/result';

const mapState = (state, props) => ({
    result: selectResult(state, props.name)
});

export default connect(mapState)(SearchResultComponent);
