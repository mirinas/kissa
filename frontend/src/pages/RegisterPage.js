import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import '../styles/LoginRegister.css';

const cookie = new Cookies();

export default function RegisterPage() {

    const [state, setState] = useState(4);

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('');

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
                    'name': '',
                    'age': 0,
                    'breed': '',
                    'sex': false,
                    'bio': '',
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

                setState(3);  
            }
        })
        .catch((err) => {
            console.error('Registration Error:', err);
        });
    };

    const handleUploadImage = () => {
        const accessToken = cookie.get('access_token');

        const data = new FormData();
        data.append('files[]', previewImage);

        fetch("http://0.0.0.0:8080/pictures/?is_profile_pic=true", 
            { 
                method: 'POST', 
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }).then(async (response) => {
                    const imageResponse = await response.json();
                    setUploadedImage(imageResponse);
            }).catch((err) => {
        });
    }

    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
        });
        fileReader.readAsDataURL(file);
    }

    // User must register first before performing any other actions such as image uploads as the auth token is granted after
    // successful registration or login
    const renderContent = () => {
        switch (state) {
            case 1:
                return <StateOne />;
            case 2:
                return ( 
                    <StateTwo 
                        handleRegister={handleRegister}

                        email={email}
                        setEmail={setEmail}

                        password={password}
                        setPassword={setPassword}

                        name={name}
                        setName={setName}
                        
                        surname={surname}
                        setSurname={setSurname}

                        dob={dob}
                        setDob={setDob}

                        bio={bio}
                        setBio={setBio}

                        gender={gender}
                        setGender={setGender}
                    />);
            case 3:
                return (
                    <StateThree 
                        previewImage={previewImage}
                        uploadedImage={uploadedImage}
                        handleUploadImage={handleUploadImage}
                        handleSelectImage={handleSelectImage}
                    />
                );
            case 4:
                return <StateFour />;
            case 5:
                return <StateFive />;
            default:
                return null;
        }
    };

    return <div>{renderContent()}</div>;
}

// Welcome screen (not in use)
function StateOne() {
    return (
        <div className='center_div'>
            <h2 className='bigtext'>Purrfect! <br/> Let's create your profile!</h2>
        </div>
    );
}

// Ask user to provide profile data
function StateTwo({ handleRegister, 
                    email, 
                    setEmail, 
                    password, 
                    setPassword, 
                    name, 
                    setName, 
                    surname, 
                    setSurname, 
                    dob, 
                    setDob, 
                    bio, 
                    setBio, 
                    gender, 
                    setGender}) {
    return (

        <form onSubmit={handleRegister}>

            <div className="center_div">

                <div className='smalltext'>
                    <h2 className='smalltext'>How can we call you?</h2>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <h2 className='smalltext'>What's your sex?</h2>

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

                <br></br>
                <div className='smalltext'>
                    <button className="btn_kissa" onClick={handleRegister}>Next</button>
                </div>
            </div>

        </form>

    )
}

// Ask user for picture verification (ai authentication needs to be implemented)
function StateThree({ previewImage, handleSelectImage, handleUploadImage, uploadedImage }) {
    return (
        <div className="center_div">
                <h2 className='smalltext'>How do you look?</h2>
                <p className='smallertext'> We <strong><em>won't</em></strong> share it publicly</p>

                <div className='smalltext'>
                    <input type="file" id="fileInput" className="file-input" onChange={handleSelectImage} />
                    <label htmlFor="fileInput" className="btn_kissa">Choose File</label>
                </div>

                <br></br>
                <div className='smalltext'>
                    {previewImage && <img src={previewImage} alt="Preview" className="user-image-preview" />}
                </div>
                <br></br>

                {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}


                <div className='smalltext'>
                    <button className="btn_kissa" onClick={handleUploadImage}>Upload</button>
                </div>
        </div>
    );
}

// Ask the user to fill in cat profile information
function StateFour({ }) {
    return (
        <>
            <div className='center_div'>
                <h2 className='bigtext'>Pawsome! <br></br> Let's hear about your furry</h2>
            </div>
        </>
    );
}

// Confirmation
function StateFive({ }) {
    return (
        <>
            <div className='center_div'>
                <h2 className='bigtext'>Meowtastic! <br></br> We are creating your profile</h2>
            </div>
        </>
    );
}
