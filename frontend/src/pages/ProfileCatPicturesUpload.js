import React, { useState } from 'react';
import { API_ENDPOINT } from '../globals';
import Cookies from 'universal-cookie';

function CatPicturesUpload({ setState }) {
    const [previewCatImages, setPreviewCatImages] = useState([]);
    const [uploadedCatImages, setUploadedCatImages] = useState([]);
    const [error, setError] = useState('');
    const [disabled, setDisabled] = useState('');

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
    
    const handleUploadCatImages = () => {
        setDisabled(true);
    
        const compressImage = async (image) => {
            return new Promise((resolve) => {
                const MAX_SIZE_MB = 1;
                const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
                const img = new Image();
    
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
    
                    // Resize the image if it exceeds the MAX_SIZE_MB limit
                    if (img.size > MAX_SIZE_BYTES) {
                        const scaleFactor = Math.sqrt(MAX_SIZE_BYTES / img.size);
                        width = Math.floor(width * scaleFactor);
                        height = Math.floor(height * scaleFactor);
                    }
    
                    canvas.width = width;
                    canvas.height = height;
    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
    
                    canvas.toBlob(
                        (blob) => {
                            resolve(new File([blob], 'compressed_image.jpg', { type: 'image/jpeg' }));
                        },
                        'image/jpeg',
                        0.7
                    );
                };
    
                img.src = URL.createObjectURL(image);
            });
        };
    
        const uploadCompressedImages = async () => {
            try {
                const compressedCatImages = await Promise.all(
                    uploadedCatImages.map(async (file) => await compressImage(file))
                );
    
                const data = new FormData();
                compressedCatImages.forEach((compressedImage, index) => {
                    data.append(`files[${index}]`, compressedImage);
                });
    
                const response = await fetch(API_ENDPOINT + "/pictures/cat", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: data,
                });
    
                if (!response.ok) {
                    setDisabled(false);
                    const errorData = await response.json();
                    setError(getErrorMessage(errorData));
    
                    console.error("Server returned an error: ", errorData);
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    setState(4);
                    const imageResponse = await response.json();
                    console.log("Image upload response: ", imageResponse);
                }
            } catch (err) {
                setDisabled(false);
                console.error("Image upload error: ", err);
            }
        };
    
        uploadCompressedImages();
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
            <div >
                {error && <p className='smalltext error-box'>{renderError(error)}</p>}
            </div>

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
                <button className="btn_kissa" onClick={handleUploadCatImages} disabled={disabled}>Upload</button>
            
            </div>
        </div>
    );
}

export default CatPicturesUpload;
