import {useOutletContext} from "react-router-dom";
import '../styles/MainPage.css'
import cat1 from '../media/cat.avif'
import cat2 from '../media/cat2.avif'
import cat3 from '../media/cat3.avif'
import {useEffect, useState} from "react";
import axios from 'axios'
import Loading from "../components/Loading";
import {GiMale, GiFemale} from 'react-icons/gi'
import {API_ENDPOINT, fetchImageData} from "../globals";
import Cookies from "universal-cookie";


// TODO: SHOW "It's a purrfect match..." screen


export default function MainPage() {

    const cookie = new Cookies();
    const token = cookie.get('access_token');
    const {setSelected} = useOutletContext();

    const cats = [cat1, cat2, cat3];
    const [images, setImages] = useState([]);
    const [profile, setProfile] = useState({});
    const [pictureIndex, setPictureIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setSelected('main');
        loadSuggestion();

    }, [setSelected]);


    const handleSkip = () => {
        axios.post(API_ENDPOINT + '/match/skip', {oid: profile.owner_id},
            {headers: {'Authorization': 'bearer ' + token}})
            .then(res => {
                console.log(res.data);
                loadSuggestion();
            });
    }


    const handleMatch = () => {
        axios.post(API_ENDPOINT + '/match/confirm', {oid: profile.owner_id},
            {headers: {'Authorization': 'bearer ' + token}})
            .then(res => {
                console.log(res.data);
                loadSuggestion();
            });
    }


    const loadSuggestion = () => {
        setLoading(true);
        axios.get(API_ENDPOINT + '/match/suggest', {
            headers: {'Authorization': 'bearer ' + token}
        })
            .then(res => {

                // If no potential matches left
                if(res.data == null) {
                    setProfile({});
                    setLoading(true);
                    setErrorMessage('No potential matches left :(');
                    return;
                }

                // Fetch images
                fetchImageData(res.data.image_ids, token)
                    .then(rs => setImages(rs.map(r => r.data)));

                setPictureIndex(0);
                setProfile(res.data);
                setLoading(false);
            });
    }


    const switchImage = e => {
        const center = e.currentTarget.offsetWidth / 2;
        if(e.nativeEvent.offsetX < center) setPictureIndex(Math.max(0, pictureIndex - 1))
        else setPictureIndex(Math.min(pictureIndex + 1, cats.length - 1))
    }

    if(loading) {
        return (
            <>
                <Loading className={'match-loading'}/>
                { !profile.owner_id && <div className={'error-message'} >{ errorMessage }</div> }
            </>
        );
    }

    return (
        <>
            <div className={'profile-view'}>
                <img alt={profile.name} src={ `data:image/jpeg;base64,${images[pictureIndex]}` } onClick={switchImage}
                     onError={e => e.currentTarget.style.display = 'none'} onLoad={e => e.currentTarget.style.display = 'unset'}/>
                <div className={'description'}>

                    <div>
                        <h3>{ profile.name }, { profile.age }</h3>
                        { profile.sex ? <GiMale style={{color: '#1c91d7'}}/> : <GiFemale style={{color: '#ef6c6b'}}/> }
                        { profile.breed !== 'N/A' && <span>{ profile.breed }</span> }
                    </div>
                    <p>{ profile.bio }</p>

                    <div className={'match-options'}>
                        <button onClick={handleMatch}>Match</button>
                        <button onClick={handleSkip}>Skip</button>
                    </div>
                </div>
            </div>
        </>
    )
}