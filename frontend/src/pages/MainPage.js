import {useOutletContext} from "react-router-dom";
import '../styles/MainPage.css'
import cat from '../media/cat.avif'
import {useEffect, useState} from "react";
import {API_ENDPOINT, devLogin} from "../globals";
import axios from 'axios'
import Loading from "../components/Loading";
import {GiMale, GiFemale} from 'react-icons/gi'


// TODO: DISPLAY MULTIPLE IMAGES
// TODO: SHOW "It's a purrfect match..." screen


export default function MainPage() {

    const {setSelected} = useOutletContext();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState('');

    useEffect(() => {
        setSelected('main');
        loadSuggestion();
    }, []);


    const handleSkip = () => {
        // TODO: call `match/skip` instead of reloading the same suggestion
        loadSuggestion();
    }


    const handleMatch = () => {
        devLogin().then(token => {
            axios.post(API_ENDPOINT + '/match/confirm', {oid: profile.owner_id},
                {headers: {'Authorization': 'bearer ' + token}})
                .then(res => {
                    console.log(res.data);
                    loadSuggestion();
                });
        });
    }


    const loadSuggestion = () => {
        setLoading(true);
        devLogin().then(token => {
            axios.get(API_ENDPOINT + '/match/suggest', {
                headers: {'Authorization': 'bearer ' + token}
            })
                .then(res => {
                    res.data.breed = 'Siamese';
                    res.data.sex = true;
                    setProfile(res.data);
                    setLoading(false);
                });
        });
    }


    return (
        <>
            { loading && <Loading className={'match-loading'}/> }
            <div className={loading ? ' loading' : 'profile-view'}>
                <img alt={'Cat'} src={cat}/>
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