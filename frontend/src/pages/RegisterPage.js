import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import '../styles/LoginRegister.css';

const cookie = new Cookies();

export default function RegisterPage() {
    const [state, setState] = useState(2);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const register = () => {
        const userData = {
            "email": "test@example.com",
            "dob": "30/05/2003",
            "password": "newpassword",
            "gender": "male",
            "name": "test",
            "surname": "Nicolisin",
            "bio": "I want to find love",
            "location": "51.50722, -0.12750",
            "profile_pic_url": "",
            "cat": {
                "name": "Fluffy",
                "age": 10,
                "breed": "N/A",
                "sex": false,
                "bio": "He loves to hunt",
                "image_ids": []
            },
            "id": "",
            "hashed_password": "",
            "matches": [],
            "matches_allowed": 3,
            "selections": [],
            "potentials": [],
            "search_radius": 999
        };

        fetch("http://localhost:8000/profiles/register", {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(userData)
        })
        .then(async (response) => {
            const data = await response.json();
            cookie.set("access_token", data.access_token, {
                path: '/', // sets cookie at root level, make it accessible to all domains

                // TODO: Set other options like expiration and whatnot
            });

            console.log("Registration data sent to server");
            setState(3);  
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

    // User must rgister first before performing any other actions such as image uploads as the auth token is needed
    const renderContent = () => {
        switch (state) {
            case 1:
                return <StateOne />;
            case 2:
                return <StateTwo 
                            register={register}
                        />;
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
function StateTwo({ register }) {
    return (
        <div className="center_div">

            <div>
                <h2 className='smalltext'>How can we call you?</h2>
                <input type="text" placeholder="Name"></input>
                <input type="text" placeholder="Surname"></input>
                <input type="text" placeholder="email"></input>
            </div>

            <div>
                <h2 className='smalltext'>What's your sex?</h2>
                <label class="radio">Male
                    <input type="radio" name="radio"></input>
                    <span class="checkmark"></span>
                </label>
                <label class="radio">Female
                    <input type="radio" name="radio"></input>
                    <span class="checkmark"></span>
                </label>
                <label class="radio">Other
                    <input type="radio" name="radio"></input>
                    <span class="checkmark"></span>
                </label>
            </div>

            <div>
                <h2 className='smalltext'>Why do you want to join us?</h2>
                <textarea placeholder="I want to find other cat people" name="multilineInput" rows="4" cols="50"></textarea>
            </div>

            <div>
                <h2 className='smalltext'>When were you born?</h2>
                <input type="date" placeholder="dd/mm/yy"></input>
            </div>

            <div className="center_div">
                <div className='smalltext'>
                    <button onClick={register}>Test</button>
                </div>
            </div>
        </div>
    )
}

// Ask user for picture for verification (still needs to be implemented)
function StateThree({ previewImage, handleSelectImage, handleUploadImage, uploadedImage }) {
    return (
        <div className="center_div">
            <div className='smalltext'>
                <h2 className='smalltext'>How do you look?</h2>
                <p className='smallertext'> We <strong><em>won't</em></strong> share it publicly</p>
                <input type="file" onChange={handleSelectImage} />
                {previewImage && <img src={previewImage} alt="Preview" />}
                {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
                <button onClick={handleUploadImage}>Upload</button>
            </div>
        </div>
    );
}

// ASk the user to fill in cat profile information
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