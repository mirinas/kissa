import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINT } from '../globals'
import Cookies from 'universal-cookie';

function UserForm({ setState })
{ 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('');

    const [catName, setCatName] = useState('');
    const [catAge, setCatAge] = useState('');
    const [catBreed, setCatBreed] = useState('');
    const [catGender, setCatGender] = useState('');
    const [catBio, setCatBio] = useState('');
    const [disabled, setDisabled] = useState('');
    const [error, setError] = useState('');
    const [preference, setPreference] = useState();
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
   
    const cookie = new Cookies();
    const expiryCheckInterval = 6000;
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');

    const convertToDisplayFormat = (isoDate) => {
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (e) => {
        setDob(e.target.value); // Keep the state in 'YYYY-MM-DD' format
    };

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
    }

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        console.log("Latitude: ", lat);
        console.log("Longitude: ", lon);
    }, [lat, lon]);

    // Fast API sends error messages with the 'detail' prefix
    // react uses 'msg'
    function getErrorMessage(error) {
        if ('detail' in error) {
            return error.detail;
        } else if ('msg' in error) {
            return error.msg;
        }
    }

    function renderError(error) {
        if (Array.isArray(error)) {
            return "You must fill in all values"
        }
        else {
            return <p>{error}</p>;
        }
    }

    const isExpired = (exp) => {
        const currentTime = Math.floor(Date.now()/1000);

        if (exp && currentTime > exp) {
            cookie.remove("access_token");
            navigate('/acc/login');
        
            console.log("Logged out, cookie has expired - please log in again.");
        }
    }

    const handleRegister = async (event) => {
        //setDisabled(true);
        event.preventDefault();

        if (password !== passwordConfirm) {
            console.error("Passwords do not match");
            setErrorMessage("Passwords do not match");
            return;
        }
        fetch(API_ENDPOINT + "/profiles/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                'email': email,
                'password': password,
                'confirm': passwordConfirm,
                'name': name,
                'surname': surname,
                'dob': convertToDisplayFormat(dob),
                'bio': bio,
                'gender': gender,
                'profile_pic_url': 'picture',
                'location': [lat, lon],
                'age_range': [18, 25],
                'preference': preference,
                'cat': {
                    'name': catName,
                    'age': catAge,
                    'breed': catBreed,
                    'sex': catGender,
                    'bio': catBio,
                    'image_ids': []
                },
            }),
        })
        .then(async (response) => {
            console.log("Server returned this for registration: ");
            console.log(response);
            console.log("\n");

            if (!response.ok) {
                setDisabled(false);

                const errorData = await response.json();
                setError(getErrorMessage(errorData));

                console.error("Server returned an error: ", errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            } 
            else {
                if (cookie) {
                    getLocation();
                    console.log("\nClient has been assigned a cookie: ");

                    const data = await response.json();
                    const token = data.access_token; 
                    const decodedToken = jwtDecode(token);
                    const exp = decodedToken.exp;

                    console.log("Cookie assigned: " + token);
                    cookie.set("access_token", token, {
                        path: '/',
                    });

                    const intervalId = setInterval(() => {
                        const accessCookie = cookie.get("access_token");
                        if (accessCookie && exp) {
                            isExpired(exp);
                        }
                    }, expiryCheckInterval);
                
                    setState(2);

                    return () => {
                        clearInterval(intervalId);                
                    }
                }
            }
        })
        .catch((err) => {
            console.error('Registration Error:', err);
            setErrorMessage(err.message);
        });
    };

    return (
    <div>
        <div >
            {error && <p className='smalltext error-box'>{renderError(error)}</p>}
        </div>

        <form onSubmit={handleRegister}>
            <div>
                <h2 className='bigtext'>Let's hear about you</h2>
                <h2 className='smalltext'>How can we call you?</h2>
                <div className='smalltext'>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>

                <h2 className='smalltext'>What's your sex?</h2>
                <div className='smalltext'>
                    <label className="radio">
                        Male
                        <input 
                            type="radio" 
                            name="gender" 
                            value="male" 
                            checked={gender === 'male'} 
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Female
                        <input 
                            type="radio" 
                            name="gender" 
                            value="female" 
                            checked={gender === 'female'} 
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Other
                        <input 
                            type="radio" 
                            name="gender" 
                            value="Other" 
                            checked={gender === 'Other'} 
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>

                <h2 className='smalltext'>You are interested in</h2>
                <div className='smalltext'>
                    <label className="radio">
                        Male
                        <input 
                            type="radio" 
                            name="preference" 
                            value="male" 
                            checked={preference === 'male'} 
                            onChange={(e) => setPreference(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Female
                        <input 
                            type="radio" 
                            name="preference" 
                            value="female" 
                            checked={preference === 'female'} 
                            onChange={(e) => setPreference(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Other
                        <input 
                            type="radio" 
                            name="preference" 
                            value="Other" 
                            checked={preference === 'Other'} 
                            onChange={(e) => setPreference(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>


                <div>
                    <h2 className='smalltext'>Why do you want to join us?</h2>
                    <div className='smalltext'>
                        <textarea 
                            placeholder="I want to find other cat people" 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            rows="4" 
                            cols="50"
                        ></textarea>
                    </div>

                </div>

                <div>
                    <h2 className='smalltext'>When were you born?</h2>
                    <div className='smalltext'>
                        <input type="date" value={dob} onChange={handleDateChange} />
                    </div>
                </div>

                <h2 className='bigtext'>Let's hear about your furry</h2>
                <h2 className='smalltext'>What's your beloved furry's name?</h2>

                <div className='smalltext'>
                    <input type="text" placeholder="Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
                    <input type="text" placeholder="Age" value={catAge} onChange={(e) => setCatAge(parseInt(e.target.value) || '')} />
                    <input type="text" placeholder="Breed" value={catBreed} onChange={(e) => setCatBreed(e.target.value)} />
                </div>

                <h2 className='smalltext'>What's your furry's sex?</h2>
                <div className='smalltext'>
                    <label className="radio">
                        Male
                        <input 
                            type="radio" 
                            name="catGender" 
                            value="false" 
                            checked={catGender === false} 
                            onChange={(e) => setCatGender(false)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Female
                        <input 
                            type="radio" 
                            name="catGender" 
                            value="true" 
                            checked={catGender === true} 
                            onChange={(e) => setCatGender(true)}
                        />
                        <span className="checkmark"></span>
                    </label>
                </div>

                <h2 className='smalltext'>What are it's special traits?</h2>
                <div className='smalltext'>
                    <textarea 
                        placeholder="I want to meet other cats" 
                        value={catBio} 
                        onChange={(e) => setCatBio(e.target.value)} 
                        rows="4" 
                        cols="50"
                    ></textarea>
                </div>

                <div className='smalltext'>
                    <button className="btn_kissa" onClick={handleRegister} disabled={disabled}>Next</button>
                </div>

                <p className='smalltext'>{errorMessage}</p>

            </div>
        </form>
    </div>    
    );
}

export default UserForm;
