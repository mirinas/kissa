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
    const [matches, setMatches] = useState([]); // Initialize as an empty array
    const [selectedMatch, setSelectedMatch] = useState('');

    const switchCat = mid => {
        setSelectedMatch(mid);
        console.log("Retrieving messages from database...");

        axios.get(API_ENDPOINT + `/match/${mid}/messages`, {
            headers: {'Authorization': 'bearer ' + token}
        })
            .then(res => {
                setMessages(res.data);
            });
    }

    useEffect(() => {
        setSelected('messages');
        console.log('started fetching match profiles');

        getMyProfile(token).then(async res => {
            setId(res.data.oid);

            const fetchedMatches = [];
            const uniqueMatches = new Set();

            for (let mid of res.data.matches) {
                const match = await axios.get(API_ENDPOINT + '/match/' + mid, {
                    headers: {'Authorization': 'bearer ' + token}
                });

                if (uniqueMatches.has(match.data.oid)) continue;

                uniqueMatches.add(match.data.oid);
                if(fetchedMatches.length === 0) switchCat(match.data.oid);

                const matchedUserId = match.data.user_1 === res.data.oid ? match.data.user_2 : match.data.user_1;
                const matchedUser = await axios.get(API_ENDPOINT + '/profiles/' + matchedUserId, {
                    headers: {'Authorization': 'bearer ' + token}
                });

                console.log(matchedUser.data.cat);

                const {image_ids} = matchedUser.data.cat;
                if (image_ids.length === 0) continue;

                const imageData = await axios.get(API_ENDPOINT + '/pictures/' + image_ids[0], {
                    headers: {'Authorization': 'bearer ' + token}
                });

                fetchedMatches.push({image: imageData.data, profile: matchedUser, mid: mid});
            }


            // reikšmės priskyrimas
            const a = 'Hello World!';

            // spausdinimo funkcijos panaudojimas
            console.log(a);


            setMatches(fetchedMatches);
        });

    }, [token, setSelected]);

    // NO MATCHES
    if(matches.length === 0) {
        return (
            <>
                <p className={'screen-message'}>You have not matched with anyone at the moment</p>
                <img className={'no-matches'} alt={'nomatches'} src={'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1af7b9bc-ab26-47dc-a812-59ce1f74e6f7/df4bcfd-33bcf25a-fe68-4b0e-b8c0-1ddca009f18f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzFhZjdiOWJjLWFiMjYtNDdkYy1hODEyLTU5Y2UxZjc0ZTZmN1wvZGY0YmNmZC0zM2JjZjI1YS1mZTY4LTRiMGUtYjhjMC0xZGRjYTAwOWYxOGYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R35RaguMbjiu1VCyazZrjOgWaKeM_zeIAgzeLiCF3IM'} />
            </>
        );
    }



    const handleSend = e => {
        if (e.key !== 'Enter') return;

        const newMessage = [{
            message: e.target.value,
            from_u: id,
            datetime: String(new Date().getTime())
        }]

        axios.post(API_ENDPOINT + `/match/${selectedMatch}/messages`, newMessage, {
            headers: {'Authorization': 'Bearer ' + token}
        })
            .then(() => {
                setMessages(messages.concat(newMessage));
                setTimeout(() => {
                    container.scrollTo(0, container.scrollHeight);
                }, 100);
            })
            .catch(err => {
            console.error("Returned by server for message post request: " + err.message);
        });

        const container = document.querySelector('main');
        e.target.value = '';
    };


    const cats = [...new Set(matches)].map(match => {
        // if(!match.image) return <></>

        let cname = match.mid === selectedMatch ? 'selected' : '';
        return (
            <img alt={match.mid} src={ `data:image/jpeg;base64,${match.image}` } width={100} height={100}
                 className={cname} onClick={() => switchCat(match.mid)} key={match.mid}/>
        );
    });

    const removeLastPart = (text, sep) => text.split(sep).splice(0, 2).join(sep);

    const messagesRender = messages.map((m, i) => {
        console.log("\nMessage User ID:", m.from_u, "Your ID:", id);
        const cname = m.from_u === id ? 'me' : 'match';
        const dateObj = new Date(parseInt(m.datetime));
        const date = dateObj.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 ?
            removeLastPart(dateObj.toLocaleTimeString(), ':') :
            removeLastPart(dateObj.toLocaleDateString(), '/')

        return <div key={i} className={'message ' + cname}>
            <span>{date}</span>
            <p>{m.message}</p>
        </div>
    });

    return (
        <>
            <div className={'cat-carousel'}>
                { cats }
            </div>
            <div className={'message-container scrollable'}>
                <br/>
                <br/>
                <br/>
                { messagesRender }
                <br/>
                <br/>
                <br/>
            </div>
            <div className={'input-container'}>
                <input className="messages-input" placeholder={'Type a message...'} onKeyDown={handleSend} />
            </div>
        </>
    );
}