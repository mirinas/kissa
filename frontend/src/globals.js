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

// TODO: REMOVE THIS FUNCTION BEFORE LAST DEPLOYMENT
export async function devLogin() {
    const loginData = {
        "username": "am26g21@soton.ac.uk",
        "password": "pass123"
    }

    // const registerData = {
    //     "email": "am26g21@soton.ac.uk",
    //     "dob": "14/01/2000",
    //     "gender": "male",
    //     "name": "A",
    //     "surname": "M",
    //     "bio": "A bio",
    //     "preference": "female",
    //     "age_range": [18, 60],
    //     "location": [0, 0],
    //     "profile_pic_url": "string",
    //     "cat": {
    //         "name": "A's Cat",
    //         "age": 0,
    //         "breed": "Siamese",
    //         "sex": false,
    //         "bio": "Cat's bio",
    //         "image_ids": []
    //     },
    //     "password": "pass123"
    // }

    // CREATING FEMALE PROFILE
    // const rand = Math.round(Math.random() * 1000);
    // await axios.post(API_ENDPOINT + '/profiles/register',
    //     {...registerData, email: `female${rand}@email.com`, gender: 'female', preference: 'male'})
    //     .then(res => console.log(res.data));

    // JUST LOGGING IN
    const res = await axios.post(API_ENDPOINT + '/profiles/token', loginData, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });

    // JUST REGISTERING
    // const res = await axios.post(API_ENDPOINT + '/profiles/register', registerData);

    return res.data.access_token;
}