import {useOutletContext} from "react-router-dom";

export default function MessagesPage() {
    const {setSelected} = useOutletContext();
    setSelected('messages');
    return <h1>Messages</h1>
}