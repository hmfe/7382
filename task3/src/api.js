import unfetch from 'unfetch';

const fetch = window.fetch || unfetch;

function fetchGet(url, signal) {
    return fetch(url, {
        mode: 'cors',
        signal
    }).then(data => data.json());
}

export const getDogsBreeds = (value, signal) =>
    fetchGet('https://api.thedogapi.com/v1/breeds', signal).then(data => {
        const resultSecondary = [];
        const resultTertiary = [];
        const resultPrimary = data.filter(item => {
            // Cheap and dirty workaround for public api.
            // In real life backend would return only valid items.
            const exprPrimary = new RegExp(`^${value}`, 'i'); // In the beginning of string.
            const exprSecondary = new RegExp(`\\s+${value}`, 'i'); // In the beginning of word.
            const exprTertiary = new RegExp(value, 'i'); // Anywhere in the string.

            if (!!item.name.match(exprPrimary)) {
                return true;
            } else if (!!item.name.match(exprSecondary)) {
                resultSecondary.push(item);

                return false;
            } else if (!!item.name.match(exprTertiary)) {
                resultTertiary.push(item);

                return false;
            }

            return false;
        });

        return resultPrimary.concat(resultSecondary, resultTertiary);
    });

export const getDogsBreedInfo = value =>
    fetchGet('https://api.thedogapi.com/v1/breeds').then(data => {
        let resultPrimary;
        const resultSecondary = [];
        const resultTertiary = [];

        data.some(item => {
            // Yet another peace of workaround for public api.
            // In real life if I had to implement search, I'd do it on backend
            // with the use of something like Sphinx.
            const preparedName = item.name.replace(/[^a-zA-Z\s]/g, ''); // Removes everything except letters & whitespaces.
            const preparedValue = value
                .replace(/&(.+);/g, '') // Removes escaped characters.
                .replace(/[^a-zA-Z\s]/g, ''); // Removes everything except letter & whitespaces.
            const exprPrimary = new RegExp(`^${preparedValue}`, 'i'); // In the beginning of string.
            const exprSecondary = new RegExp(`\\s+${preparedValue}`, 'i'); // In the beginning of word.
            const exprTertiary = new RegExp(preparedValue, 'i'); // Anywhere in the string.

            if (!!preparedName.match(exprPrimary)) {
                resultPrimary = item;

                return true;
            } else if (!!preparedName.match(exprSecondary)) {
                resultSecondary.push(item);

                return false;
            } else if (!!preparedName.match(exprTertiary)) {
                resultTertiary.push(item);

                return false;
            }

            return false;
        });

        return (
            resultPrimary ||
            resultSecondary[0] ||
            resultTertiary[0] || { message: 'No breed found.' }
        );
    });
