import {useOutletContext} from "react-router-dom";
import '../styles/MainPage.css'
import cat from '../media/cat.avif'
import {useEffect} from "react";

export default function MainPage() {
    const {setSelected} = useOutletContext();
    useEffect(() => setSelected('main'));

    return (
        <div className={'profile-view'}>
            <img alt={'Cat'} src={cat}/>
            <div className={'description'}>
                <h3>Haika <span>1.5km</span></h3>
                <p>Description about the owner and the cat</p>
                <div className={'match-options'}>
                    <button>Match</button>
                    <button>Skip</button>
                </div>
            </div>
        </div>
    )
}