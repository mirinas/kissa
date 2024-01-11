import axios from 'axios';

export const API_ENDPOINT = process.env.REACT_APP_KISSA_API_ENDPOINT || 'http://localhost:8080';

export function fetchImageData(ids, token) {
    return Promise.all(ids.map(id => {
        return axios.get(API_ENDPOINT + '/pictures/' + id, {
            headers: {'Authorization': 'bearer ' + token}
        });
    }))
}

export function getMyProfile(token) {
    return axios.get(API_ENDPOINT + '/profiles/me', {
        headers: {'Authorization': 'bearer ' + token}
    });
}

export function patchMyProfile(id, token, data) {
    return axios.patch(API_ENDPOINT + '/profiles/' + id, data,
        {headers: {'Authorization': 'bearer ' + token}})
        .catch(err => console.error(err.message));
}
