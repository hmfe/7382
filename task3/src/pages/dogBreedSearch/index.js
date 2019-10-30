import React from 'react';
import DocumentTitle from 'react-document-title';

import { getDogsBreeds, getDogsBreedInfo } from 'api';
import { Form, Result, History } from 'modules/search';

import { DOG_BREED_SEARCH_NAME } from './constants';

const PageDogBreedSearch = () => {
    const title = 'Search for dogs breeds info';

    return (
        <DocumentTitle title={title}>
            <main className="wrapper">
                <header>
                    <h1>{title}</h1>
                </header>
                <Form
                    name={DOG_BREED_SEARCH_NAME}
                    label={title}
                    suggestLabel="Dog breeds"
                    placeholder="Example: akita"
                    api={getDogsBreedInfo}
                    suggestApi={getDogsBreeds}
                />
                <Result name={DOG_BREED_SEARCH_NAME} />
                <History name={DOG_BREED_SEARCH_NAME} />
            </main>
        </DocumentTitle>
    );
};

export default PageDogBreedSearch;
