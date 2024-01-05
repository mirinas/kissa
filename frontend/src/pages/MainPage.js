import {useOutletContext} from "react-router-dom";
import '../styles/MainPage.css'
import cat from '../media/cat.avif'
import {useEffect} from "react";
import {API_ENDPOINT} from "../globals";
import axios from 'axios'

export default function MainPage() {
    const {setSelected} = useOutletContext();
    useEffect(() => setSelected('main'), [setSelected]);

    const handleMatch = () => {
        axios.post(API_ENDPOINT + '/profiles/token', {
            username: 'newuser@example.com',
            password: 'newpassword'
        }, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(r => console.log(r.data)
        ).catch(e => console.error(e));
    }

    return (
        <div className={'profile-view'}>
            <img alt={'Cat'} src={cat}/>
            <div className={'description'}>
                <h3>Haika <span>1.5km</span></h3>
                <p>Description about the owner and the cat</p>
                <div className={'match-options'}>
                    <button onClick={handleMatch}>Match</button>
                    <button>Skip</button>
                </div>
            </div>
        </div>
    )
}