import React, { useState } from 'react';
import { API_ENDPOINT } from '../globals'
import Cookies from 'universal-cookie';

function UserPictureUpload({ setState }) {

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [disabled, setDisabled] = useState('');
    const [error, setError] = useState('');
    
    const cookie = new Cookies();
    const accessToken = cookie.get('access_token');
    
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

    const handleUploadImage = () => {
        setDisabled(true);

        const data = new FormData();
        data.append('file', uploadedImage);

        fetch(API_ENDPOINT + "/pictures", 
            { 
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: data

            }).then(async (response) => {
                if (!response.ok) {
                    setDisabled(false);
                    const errorData = await response.json();
                    setError(getErrorMessage(errorData));

                    console.error("Server returned an error: ", errorData);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else {
                    setState(3);
                }
            }).catch((err) => {
                console.log("Image upload error: ", err);
            });
    }

    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        setUploadedImage(file);


        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
        });
        fileReader.readAsDataURL(file);
    }

    return (
        <div className="center_div">

            <h2 className='smalltext'>How do you look?</h2>
            {error && <p className='smalltext error-box'>{renderError(error)}</p>}
            <p className='smallertext'> We <strong><em>won't</em></strong> share it publicly</p>

            <div className='smalltext'>
                <input type="file" id="fileInput" className="file-input" onChange={handleSelectImage} />
                <label htmlFor="fileInput" className="btn_kissa">Choose File</label>
            </div>

            <br></br>
            <div className='smalltext'>
                {previewImage && <img src={previewImage} alt="Preview" className="user_image_preview" />}
            </div>
            <br></br>


            <div className='smalltext'>
                <button className="btn_kissa" onClick={handleUploadImage} disabled={disabled}>Upload</button>
            </div>
        </div>
    );
}

export default UserPictureUpload;
