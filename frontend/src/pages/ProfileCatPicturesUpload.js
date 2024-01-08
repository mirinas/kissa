import React, { useState } from 'react';
import { API_ENDPOINT } from '../globals';
import Cookies from 'universal-cookie';

function CatPicturesUpload({ setState }) {
    const [previewCatImages, setPreviewCatImages] = useState([]);
    const [uploadedCatImages, setUploadedCatImages] = useState([]);

    const cookie = new Cookies();
    const accessToken = cookie.get('access_token');
    
    const handleUploadCatImages = () => {

        const data = new FormData();
        uploadedCatImages.forEach((file) => {
            data.append('files', file);
        });

        fetch(API_ENDPOINT + "/pictures/cat", 
            { 
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: data
            })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setState(4);
                return response.json();
            })
            .then(imageResponse => {
                console.log("Image upload response: ", imageResponse);
            })
            .catch((err) => {
                console.error("Image upload error: ", err);
            });
    };

    const handleSelectImageCat = (event) => {
        const files = Array.from(event.target.files);
        setUploadedCatImages(files);

        const readers = [];

        setPreviewCatImages([]);

        files.forEach((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                setPreviewCatImages((prevImages) => [...prevImages, e.target.result]);
            };
            fileReader.readAsDataURL(file);
            readers.push(fileReader);
        });
    }

    return (
        <div className='center_div'>
            <h2 className='smalltext'>How does he/she look?</h2>
            <p className='smallertext'> We <strong><em>will</em></strong> share it publicly</p>

            <div className='smalltext'>
                <input type="file" id="catImageInput" className="file-input" onChange={handleSelectImageCat} multiple />
            </div>

                <div className="cat_image_container">
                    {previewCatImages.map((image, index) => (
                        <img key={index} src={image} alt={""} className="image_preview_cat" />
                    ))}
                </div>

            <div className='smalltext'>
                <label htmlFor="catImageInput" className="btn_kissa">Select images(3)</label>
                <br></br>
                <button className="btn_kissa" onClick={handleUploadCatImages}>Upload</button>
            
            </div>
        </div>
    );
}

export default CatPicturesUpload;
