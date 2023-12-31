import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

export default function MessagesPage() {
    const {setSelected} = useOutletContext();
    useEffect(() => setSelected('messages'));

    return <h1>Messages</h1>
}