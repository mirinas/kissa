import {useOutletContext} from "react-router-dom";

export default function SettingsPage() {
    const {setSelected} = useOutletContext();
    setSelected('settings');
    return <h1>Settings</h1>
}