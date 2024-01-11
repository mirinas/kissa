import {useNavigate, useOutletContext} from "react-router-dom";
import '../styles/MainPage.css'
import cat1 from '../media/cat.avif'
import cat2 from '../media/cat2.avif'
import cat3 from '../media/cat3.avif'
import {useEffect, useState} from "react";
import axios from 'axios'
import Loading from "../components/Loading";
import {GiMale, GiFemale} from 'react-icons/gi'
import {API_ENDPOINT, fetchImageData, getMyProfile, patchMyProfile} from "../globals";
import Cookies from "universal-cookie";


export default function MainPage() {

    const navigate = useNavigate();
    const cookie = new Cookies();
    const token = cookie.get('access_token');
    const {setSelected} = useOutletContext();

    const cats = [cat1, cat2, cat3];
    const [images, setImages] = useState([]);
    const [profile, setProfile] = useState({});
    const [pictureIndex, setPictureIndex] = useState(0);

    const [matchesLeft, setMatchesLeft] = useState(true);
    const [matchStatus, setMatchStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setSelected('main');
        loadSuggestion()
            .catch(err => console.error(err));

    }, []);


    const handleSkip = () => {
        axios.post(API_ENDPOINT + '/match/skip', {oid: profile.owner_id},
            {headers: {'Authorization': 'bearer ' + token}})
            .then(res => {
                console.log(res.data);
                loadSuggestion()
                    .catch(err => console.error(err));
            });
    }


    const handleMatch = () => {
        axios.post(API_ENDPOINT + '/match/confirm', {oid: profile.owner_id},
            {headers: {'Authorization': 'bearer ' + token}})
            .then(res => {
                // no match
                if(res.data.match_id == null) {
                    loadSuggestion()
                        .catch(err => console.error(err));
                    return;
                }

                // matched - redirect to messages
                setMatchStatus(true);
            });
    }


    const loadSuggestion = async () => {
        setLoading(true);

        // update location
        const profile = await getMyProfile(token).then(res => res.data);
        console.log(profile);

        await navigator.geolocation.getCurrentPosition(async pos => {
            const {coords} = pos;
            await patchMyProfile(profile.oid, token, {
                location: [coords.latitude, coords.longitude]
            });
        });

        const suggestion = await axios.get(API_ENDPOINT + '/match/suggest', {
            headers: {'Authorization': 'bearer ' + token}
        })
            .then(res => res.data)
            .catch(() => {
                setMatchesLeft(false);
                return null;
            });

        // If no potential matches left
        if(suggestion == null) {
            setProfile({});
            setLoading(false);
            return;
        }

        // Fetch images
        fetchImageData(suggestion.image_ids, token)
            .then(rs => setImages(rs.map(r => r.data)));

        setPictureIndex(0);
        setProfile(suggestion);
        setLoading(false);
    }


    const switchImage = e => {
        const center = e.currentTarget.offsetWidth / 2;
        if(e.nativeEvent.offsetX < center) setPictureIndex(Math.max(0, pictureIndex - 1))
        else setPictureIndex(Math.min(pictureIndex + 1, cats.length - 1))
    }

    if(matchStatus) {
        document.querySelector('nav').style.visibility = 'hidden';
        setTimeout(() => {
            navigate('/app/messages');
            document.querySelector('nav').style.visibility = 'visible';
        }, 3000);

        return (
            <div className={'screen-message'} >
                It's a purrfect match...
            </div>
        );
    }

    if(loading) return <Loading />
    if(!matchesLeft) {
        return (
            <div className={'screen-message'} >
                You have reached your matches limit (3)
            </div>
        );
    }
    if(!profile.owner_id) {
        return (
            <div className={'screen-message'} >
                No potential matches currently available
            </div>
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