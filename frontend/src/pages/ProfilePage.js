import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/ProfilePage.css'
import HSlider from "../components/HSlider";
import {API_ENDPOINT, devLogin} from "../globals";
import axios from "axios";
import Loading from "../components/Loading";

export default function ProfilePage() {
    const {setSelected} = useOutletContext();
    const openedState = useState('Preferences');
    const [loading, setLoading] = useState(false);

    const [id, setId] = useState('');
    const rangeState = useState(2);
    const ageState = useState([18, 18]);
    const [cat, setCat] = useState({});
    const matchingPrefsState = useState(
        {'male': true, 'female': false, 'other': false}
    );

    const [bio, setBio] = useState('');

    useEffect(() => setSelected('profile'), [setSelected]);
    useEffect(() => {
        setLoading(true);
        devLogin().then(token => {
            axios.get(API_ENDPOINT + '/profiles/me', {headers: {'Authorization': 'bearer ' + token}})
                .then(res => {
                    rangeState[1](res.data.search_radius);
                    ageState[1](res.data.age_range);
                    setBio(res.data.bio);

                    const newMatchingPrefs = {...matchingPrefsState};
                    newMatchingPrefs[res.data.preference] = true;
                    matchingPrefsState[1](newMatchingPrefs);
                    setId(res.data.oid);
                    setCat(res.data.cat);

                    setLoading(false);
                });
        });
    }, []);

    const handleRange = () => {
        patchProfile(id, {search_radius: rangeState[0]});
    }

    const handleAge = () => {
        patchProfile(id, {age_range: ageState[0]});
    }

    const handleBio = () => {
        patchProfile(id, {bio});
    }

    const handleCat = () => {

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
                    <Checkbox label={'Males'} value={'male'} state={matchingPrefsState}/>
                    <Checkbox label={'Females'} value={'female'} state={matchingPrefsState}/>
                    <Checkbox label={'Others'} value={'other'} state={matchingPrefsState}/>
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
            </Section>
        </div>
    );
}

function patchProfile(id, data) {
    devLogin().then(token => {
        axios.patch(API_ENDPOINT + '/profiles/' + id, data,
            {headers: {'Authorization': 'bearer ' + token}})
            .then(res => console.log(res));
    });
}


function Checkbox({label, value, state}) {
    const [prefs, setPrefs] = state;

    const handleClick = e => {
        const newPrefs = {...prefs};
        const box = e.target;

        if(Object.values(prefs).filter(e => e).length === 1 &&
            box.classList.contains('checked')) return;

        box.classList.toggle('checked');
        newPrefs[value] = box.classList.contains('checked');
        setPrefs(newPrefs);
    }

    return (
        <div className={'checkbox'}>
            <div className={'box' + (prefs[value] ? ' checked' : '')} onClick={handleClick}/>
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