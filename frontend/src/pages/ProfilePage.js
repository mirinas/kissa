import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/ProfilePage.css'
import HSlider from "../components/HSlider";
import {API_ENDPOINT} from "../globals";
import axios from "axios";
import Loading from "../components/Loading";
import Cookies from "universal-cookie";
import {patchMyProfile} from '../globals';

export default function ProfilePage() {

    const cookie = new Cookies();
    const token = cookie.get('access_token');

    const {setSelected} = useOutletContext();
    const openedState = useState('Preferences');
    const [loading, setLoading] = useState(false);
    const [pictureIndex, setPictureIndex] = useState(0);

    const [id, setId] = useState('');
    const rangeState = useState(2);
    const ageState = useState([18, 18]);
    const [cat, setCat] = useState({});
    const [pref, setPref] = useState('');

    const [bio, setBio] = useState('');

    useEffect(() => setSelected('profile'), [setSelected]);
    useEffect(() => {
        setLoading(true);
        axios.get(API_ENDPOINT + '/profiles/me', {headers: {'Authorization': 'bearer ' + token}})
            .then(res => {

                rangeState[1](res.data.search_radius);
                ageState[1](res.data.age_range);
                setBio(res.data.bio);

                setPref(res.data.preference);
                setId(res.data.oid);
                setCat(res.data.cat);
                setPictureIndex(0);

                setLoading(false);
            });
    }, []);

    const handleRange = () => {
        patchMyProfile(id, token, {search_radius: rangeState[0].toFixed(1)});
    }

    const handleAge = () => {
        patchMyProfile(id, token, {age_range: ageState[0]});
    }

    const handleBio = e => {
        const newBio = e.target.value;
        setBio(newBio);
        patchMyProfile(id, token, {bio: newBio});
    }

    const handleCat = e => {

    }

    const handlePref = newPref => {
        setPref(newPref);
        patchMyProfile(id, token, {'preference': newPref});
    }

    const switchImage = e => {
        const center = e.currentTarget.offsetWidth / 2;
        if(e.nativeEvent.offsetX < center) setPictureIndex(Math.max(0, pictureIndex - 1))
        else setPictureIndex(Math.min(pictureIndex + 1, cat.image_ids.length - 1))
    }


    const uploadImages = e => {
        const images = Array.from(e.target.files);

        const data = new FormData();
        images.forEach(f => {
            data.append('files', f);
        });

        // use data to POST in /pictures/cat endpoint
        // patch IDs received to the profile
    }


    if(loading) return <Loading />
    return (
        <div className={'preferences-view'}>
            <Section title={'Preferences'} openedState={openedState}>
                <h5>Matching range</h5>
                <HSlider state={rangeState} min={2} max={50} label={'km'} onBlur={handleRange}/>
                <h5>Age preference</h5>
                <HSlider state={ageState} min={18} max={90} count={2} onBlur={handleAge}/>
                <h5>Interested in</h5>
                <form>
                    <Checkbox label={'Males'} value={'male'} handlePref={handlePref} checked={pref === 'male'}/>
                    <Checkbox label={'Females'} value={'female'} handlePref={handlePref} checked={pref === 'female'}/>
                    <Checkbox label={'Others'} value={'other'} handlePref={handlePref} checked={pref === 'other'}/>
                </form>
            </Section>
            <Section title={'Your details'} openedState={openedState}>
                <h5>Your description</h5>
                <textarea placeholder={'I like cats...'} className={'scrollable user-description'} defaultValue={bio} onBlur={handleBio}/>
            </Section>
            <Section title={'Your cat'} openedState={openedState}>
                <h5>Cat name</h5>
                <input placeholder={'Name of your cat'} defaultValue={cat.name} onBlur={handleCat} />
                <h5>Breed</h5>
                <input placeholder={'Breed of your cat'} defaultValue={cat.breed} onBlur={handleCat} />
                <h5>Cat bio</h5>
                <textarea placeholder={'Cute cat description...'} className={'scrollable user-description'} defaultValue={cat.bio} onBlur={handleCat}/>
                {(cat.image && cat.image_ids.length > 0) &&
                    <img alt={'Cat'} src={ cat.image_ids[pictureIndex] } onClick={switchImage}/>}
            </Section>
        </div>
    );
}


function Checkbox({label, value, handlePref, checked}) {
    return (
        <div className={'checkbox'}>
            <div className={'box' + (checked ? ' checked' : '')} onClick={() => handlePref(value)}/>
            <label>{label}</label>
        </div>
    )
}


function Section({title, openedState, children}) {
    const [opened, setOpened] = openedState;

    return (
        <section className={'scrollable'}>
            <h4 onClick={ () => setOpened(title) }>{title}</h4>
            <div className={'section-body' + (title === opened ? ' opened' : '')}>
                {children}
            </div>
        </section>
    );
}