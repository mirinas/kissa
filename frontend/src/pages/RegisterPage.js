import React, { useEffect, useState } from 'react';
import {useOutletContext} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import UserForm from './ProfileRegistrationForm';
import CatPicturesUpload from './ProfileCatPicturesUpload'
import UserPictureUpload from './ProfileUserPictureUpload'
import '../styles/LoginRegister.css';

export default function RegisterPage() {
    const {setSelected} = useOutletContext();
    useEffect(() => setSelected('register'), [setSelected]);

    const navigate = useNavigate();
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
                navigate('/app/');
                return null;
        }
    };

    return <div>{renderContent()}</div>;
}
