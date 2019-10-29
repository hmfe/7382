import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from 'utils/configureStore';

import './styles/global.raw.scss';

import DogBreedSearch from 'pages/dogBreedSearch';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <DogBreedSearch />
    </Provider>,
    document.getElementById('root')
);
