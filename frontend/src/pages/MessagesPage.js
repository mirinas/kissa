import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";
import '../styles/MessagesPage.css';
import {API_ENDPOINT, devLogin, getMyProfile} from "../globals";
import axios from 'axios';
import Cookies from "universal-cookie";

export default function MessagesPage() {

    const cookie = new Cookies();
    const token = cookie.get('access_token');
    const {setSelected} = useOutletContext();

    useEffect(() => setSelected('messages'), [setSelected]);

    useEffect(() => {
        getMyProfile(token).then(res => {
           console.log(res.data);
        });
    }, []);

    const matches = [
        'https://i.etsystatic.com/26335741/r/il/c644eb/3162142982/il_570xN.3162142982_8bqs.jpg',
        'https://i1.wp.com/www.irishaspetportraits.co.uk/wp-content/uploads/2021/02/toby-large-res.jpg?fit=732%2C1024&ssl=1',
        'https://www.warrenphotographic.co.uk/photography/bigs/37974-Tabby-cat-portrait-white-background.jpg',
        'https://i.etsystatic.com/26335741/r/il/c644eb/3162142982/il_570xN.3162142982_8bqs.jpg',
        'https://i1.wp.com/www.irishaspetportraits.co.uk/wp-content/uploads/2021/02/toby-large-res.jpg?fit=732%2C1024&ssl=1',
        'https://www.warrenphotographic.co.uk/photography/bigs/37974-Tabby-cat-portrait-white-background.jpg'
    ].map((url, i) => {
        let cname = 'scrollable';
        if(i === 0) cname += ' selected';
        return (
            <img key={i} alt={'match' + i} src={url} width={100} height={100} className={cname}/>
        );
    });

    // useEffect(() => {
    //     devLogin().then(token => {
    //         axios.get(API_ENDPOINT + '/profiles/me')
    //             .then();
    //     });
    // }, []);

    return (
        <>
            <div className={'cat-carousel'}>
                { matches }
            </div>
        </>
    );
}