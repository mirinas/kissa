import {Link, Outlet} from "react-router-dom";
import '../styles/MainLayout.css'
import { LuMessagesSquare, LuCat, LuUser } from "react-icons/lu";
import {useState} from "react";

export default function MainLayout() {

    const [selected, setSelected] = useState('main');
    const selectedClass = page => selected === page ? 'selected' : '';

    return (
        <>
            <div className={'main-pages'}>
                <main>
                    <Outlet context={{ setSelected }}/>
                </main>
                <nav>
                    <Link className={selectedClass('settings')} to={'/app/settings'}><LuUser /></Link>
                    <Link className={selectedClass('main')} to={'/app/'}><LuCat /></Link>
                    <Link className={selectedClass('messages')} to={'/app/messages'}><LuMessagesSquare /></Link>
                </nav>
            </div>
        </>
    )
}