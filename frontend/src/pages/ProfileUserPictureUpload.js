import React, { useState } from 'react';
import Cookies from 'universal-cookie';

function UserPictureUpload({ setState }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const cookie = new Cookies();
    const accessToken = cookie.get('access_token');

    const handleUploadImage = () => {

        const data = new FormData();
        data.append('file', uploadedImage);

        fetch("http://localhost:8000/pictures", 
            { 
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: data

            }).then(async (response) => {
                //const imageResponse = await response.json();
                setState(3);
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

export default UserPictureUpload;
