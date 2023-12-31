import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/ProfilePage.css'
import HSlider from "../components/HSlider";

export default function ProfilePage() {
    const {setSelected} = useOutletContext();
    useEffect(() => setSelected('profile'));

    const openedState = useState('Preferences');
    const rangeState = useState(20);
    const matchingPrefsState = useState(
        {'males': true, 'females': false, 'others': false}
    );

    return (
        <div className={'preferences-view'}>
            <Section title={'Preferences'} openedState={openedState}>
                <h5>Matching range</h5>
                <HSlider state={rangeState} min={2} max={50} label={'km'}/>
                <h5>Interested in</h5>
                <form>
                    <Checkbox label={'Males'} state={matchingPrefsState}/>
                    <Checkbox label={'Females'} state={matchingPrefsState}/>
                    <Checkbox label={'Others'} state={matchingPrefsState}/>
                </form>
            </Section>
            <Section title={'Your details'} openedState={openedState}>
                <h5>Languages</h5>
                <input placeholder={'Languages spoken'}/>
                <h5>Your description</h5>
                <textarea placeholder={'I like cats...'} className={'scrollable user-description'}/>
            </Section>
            <Section title={'Your cats'} openedState={openedState}>
            </Section>
        </div>
    );
}


function Checkbox({label, state}) {
    const [prefs, setPrefs] = state;
    const labelLC = String(label).toLowerCase();

    // TODO: make at least one checkbox required
    const handleClick = e => {
        const newPrefs = {...prefs};
        const box = e.target;
        box.classList.toggle('checked');
        newPrefs[labelLC] = box.classList.contains('checked');

        console.log(newPrefs);
        setPrefs(newPrefs);
    }

    return (
        <div className={'checkbox'}>
            <div className={'box' + (prefs[labelLC] ? ' checked' : '')} onClick={handleClick}/>
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