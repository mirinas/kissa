import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/MessagesPage.css';
import {API_ENDPOINT, devLogin, getMyProfile, patchMyProfile} from "../globals";
import axios from 'axios';
import Cookies from "universal-cookie";

export default function MessagesPage() {

    const cookie = new Cookies();
    const token = cookie.get('access_token');
    const {setSelected} = useOutletContext();

    const [matches, setMatches] = useState([]);
    const [matchIndex, setMatchIndex] = useState(0);

    useEffect(() => {
        setSelected('messages');

        getMyProfile(token).then(res => {
            res.data.matches.forEach(async (mid, i) => {

                const match = await axios.get(API_ENDPOINT + '/match/' + mid, {
                    headers: {'Authorization': 'bearer ' + token}
                });

                console.log(match);

                const messages = [];
                if(i === 0) {
                    // get messages
                }
            });
        });
    }, []);

    // const matches = [
    //     'https://i.etsystatic.com/26335741/r/il/c644eb/3162142982/il_570xN.3162142982_8bqs.jpg',
    //     'https://i1.wp.com/www.irishaspetportraits.co.uk/wp-content/uploads/2021/02/toby-large-res.jpg?fit=732%2C1024&ssl=1',
    //     'https://www.warrenphotographic.co.uk/photography/bigs/37974-Tabby-cat-portrait-white-background.jpg',
    //     'https://i.etsystatic.com/26335741/r/il/c644eb/3162142982/il_570xN.3162142982_8bqs.jpg',
    //     'https://i1.wp.com/www.irishaspetportraits.co.uk/wp-content/uploads/2021/02/toby-large-res.jpg?fit=732%2C1024&ssl=1',
    //     'https://www.warrenphotographic.co.uk/photography/bigs/37974-Tabby-cat-portrait-white-background.jpg'
    // ].map((url, i) => {
    //     let cname = 'scrollable';
    //     if(i === 0) cname += ' selected';
    //     return (
    //         <img key={i} alt={'match' + i} src={url} width={100} height={100} className={cname}/>
    //     );
    // });

    if(matches.length === 0) {
        return (
            <>
                <p className={'screen-message'}>You have not matched with anyone at the moment</p>
                <img className={'no-matches'} alt={'nomatches'} src={'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1af7b9bc-ab26-47dc-a812-59ce1f74e6f7/df4bcfd-33bcf25a-fe68-4b0e-b8c0-1ddca009f18f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFhZjdiOWJjLWFiMjYtNDdkYy1hODEyLTU5Y2UxZjc0ZTZmN1wvZGY0YmNmZC0zM2JjZjI1YS1mZTY4LTRiMGUtYjhjMC0xZGRjYTAwOWYxOGYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R35RaguMbjiu1VCyazZrjOgWaKeM_zeIAgzeLiCF3IM'} />
            </>
        );
    }

    return (
        <>
            <div className={'cat-carousel'}>
                { matches }
            </div>
        </>
    );
}