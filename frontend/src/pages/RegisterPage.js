import React, { useState } from 'react';
import UserForm from './ProfileRegistrationForm';
import CatPicturesUpload from './ProfileCatPicturesUpload'
import UserPictureUpload from './ProfileUserPictureUpload'
import '../styles/LoginRegister.css';

export default function RegisterPage() {

    const [state, setState] = useState(1);

    // User must login or register first for auth token
    const renderContent = () => {
        switch (state) {
            case 1:
                return <UserForm setState={setState}/>
            case 2:
                return <UserPictureUpload setState={setState}/>
            case 3:
                return <CatPicturesUpload setState={setState}/>
            default:
                return null;
        }
    };

    return <div>{renderContent()}</div>;
}
