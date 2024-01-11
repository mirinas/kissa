import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import '../styles/MessagesPage.css';
import {API_ENDPOINT, fetchImageData, getMyProfile} from "../globals";
import axios from 'axios';
import Cookies from "universal-cookie";

export default function MessagesPage() {

    const cookie = new Cookies();
    const token = cookie.get('access_token');
    const {setSelected} = useOutletContext();

    const [id, setId] = useState('');
    const [messages, setMessages] = useState([]);
    const [matches, setMatches] = useState([{}]);
    const [selectedMatch, setSelectedMatch] = useState('');

    useEffect(() => {
        setSelected('messages');

        getMyProfile(token).then(res => {
            setId(res.data.oid);

            res.data.matches.forEach(async (mid, i) => {
                const match = await axios.get(API_ENDPOINT + '/match/' + mid, {
                    headers: {'Authorization': 'bearer ' + token}
                });

                if(i === 0) switchCat(match.data.oid);

                const matchedUserId = match.data.user_1 === res.data.oid ? match.data.user_2 : match.data.user_1;
                const matchedUser = await axios.get(API_ENDPOINT + '/profiles/' + matchedUserId, {
                    headers: {'Authorization': 'bearer ' + token}
                });

                const {image_ids} = matchedUser.data.cat;
                if(image_ids.length === 0) return;

                const imageData = await axios.get(API_ENDPOINT + '/pictures/' + image_ids[0], {
                    headers: {'Authorization': 'bearer ' + token}
                });
                setMatches(matches.concat([{image: imageData.data, profile: matchedUser, mid: mid}]));
            });
        });

    }, []);

    // NO MATCHES
    if(matches.length === 0) {
        return (
            <>
                <p className={'screen-message'}>You have not matched with anyone at the moment</p>
                <img className={'no-matches'} alt={'nomatches'} src={'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1af7b9bc-ab26-47dc-a812-59ce1f74e6f7/df4bcfd-33bcf25a-fe68-4b0e-b8c0-1ddca009f18f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFhZjdiOWJjLWFiMjYtNDdkYy1hODEyLTU5Y2UxZjc0ZTZmN1wvZGY0YmNmZC0zM2JjZjI1YS1mZTY4LTRiMGUtYjhjMC0xZGRjYTAwOWYxOGYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R35RaguMbjiu1VCyazZrjOgWaKeM_zeIAgzeLiCF3IM'} />
            </>
        );
    }



    const switchCat = mid => {
        setSelectedMatch(mid);
        axios.get(API_ENDPOINT + `/match/${mid}/messages`, {
            headers: {'Authorization': 'bearer ' + token}
        })
            .then(res => {
                setMessages(res.data);
            });
    }


    const handleSend = e => {
        if (e.key !== 'Enter') return;

        e.target.value = '';
        axios.post(API_ENDPOINT + `/match/${selectedMatch}/messages`, {
            headers: {'Authorization': 'bearer ' + token}
        }).catch(err => console.log(err.message));
    }


    const cats = [...new Set(matches)].map(match => {
        if(!match.image) return <></>

        let cname = 'scrollable';
        if(match.mid === selectedMatch) cname += ' selected';
        return (
            <img key={match.mid} alt={match.mid} src={ `data:image/jpeg;base64,${match.image}` } width={100} height={100}
                 className={cname} onClick={() => switchCat(match.mid)}/>
        );
    });

    messages.map((m, i) => {
        console.log(m);
        const cname = m.from_u === id ? 'me' : 'match';
        return <p key={i} className={'message ' + cname}>{m.message}</p>
    });

    return (
        <>
            <div className={'cat-carousel'}>
                { cats }
            </div>
            <div className={'message-container'}>
                { messages }
            </div>
            <input placeholder={'Type a message...'} onKeyDown={handleSend} />
        </>
    );
}