import axios from 'axios';

export const API_ENDPOINT = process.env.REACT_APP_KISSA_API_ENDPOINT || 'http://localhost:8080';

// TODO: REMOVE THIS FUNCTION BEFORE LAST DEPLOYMENT
export async function devLogin() {
    const loginData = {
        "username": "augustas@doesnotexist.com",
        "password": "string"
    }

    const registerData = {
        "email": "augustas@doesnotexist.com",
        "dob": "string",
        "gender": "string",
        "name": "string",
        "surname": "string",
        "bio": "string",
        "preference": "string",
        "age_range": [18, 40],
        "location": [0, 0],
        "profile_pic_url": "string",
        "cat": {
            "name": "string",
            "age": 0,
            "breed": "string",
            "sex": true,
            "bio": "string",
            "image_ids": []
        },
        "password": "string"
    }

    const res = await axios.post(API_ENDPOINT + '/profiles/register', registerData).catch(() => {
        return axios.post(API_ENDPOINT + '/profiles/token', loginData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    });
    return res.data.access_token;
}