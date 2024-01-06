import React, { useState } from 'react';
import Cookies from 'universal-cookie';

function UserForm({ setState })
{ 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
   
    const cookie = new Cookies();

    const handleRegister = async (event) => {
        event.preventDefault();
        fetch("http://localhost:8000/profiles/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                'email': email,
                'password': password,
                'name': name,
                'surname': surname,
                'dob': dob,
                'bio': bio,
                'gender': gender,
                'location': '',
                'profile_pic_url': '',
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
                const errorData = await response.json();
                console.error("Server returned an error: ", errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                cookie.set("access_token", data.access_token, {
                    path: '/', // sets cookie at root level, make it accessible to all domains

                    // TODO: Set other options like expiration and whatnot
                });

                if (cookie) {
                    console.log("\nClient has been assigned a cookie: ");
                    console.log(cookie)
                    setState(2);
                }
            }
        })
        .catch((err) => {
            console.error('Registration Error:', err);
        });
    };

    return (
    <div>
        <form onSubmit={handleRegister}>
            <div>
                <h2 className='smalltext'>How can we call you?</h2>
                <div className='smalltext'>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <h2 className='smalltext'>What's your sex?</h2>
                <div className='smalltext'>
                    <label className="radio">
                        Male
                        <input 
                            type="radio" 
                            name="gender" 
                            value="Male" 
                            checked={gender === 'Male'} 
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <label className="radio">
                        Female
                        <input 
                            type="radio" 
                            name="gender" 
                            value="Female" 
                            checked={gender === 'Female'} 
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
                        <input type="date" placeholder="dd/mm/yy" value={dob} onChange={(e) => setDob(e.target.value)} />
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

                <h2 className='smalltext'>What are the special traits?</h2>
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
                    <button className="btn_kissa" onClick={handleRegister}>Next</button>
                </div>

            </div>
        </form>
    </div>    
    );
}

export default UserForm;
