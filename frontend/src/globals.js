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
        "dob": "14/01/2000",
        "gender": "male",
        "name": "string",
        "surname": "string",
        "bio": "string",
        "preference": "female",
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

    // const rand = Math.round(Math.random() * 1000);
    // await axios.post(API_ENDPOINT + '/profiles/register',
    //     {...registerData, email: `female${rand}@email.com`, gender: 'female', preference: 'male'})
    //     .then(res => console.log(res.data));

    const res = await axios.post(API_ENDPOINT + '/profiles/token', loginData, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).catch(() => {
        return axios.post(API_ENDPOINT + '/profiles/register', registerData);
    });

    return res.data.access_token;
}