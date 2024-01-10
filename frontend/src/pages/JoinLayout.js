import {Link, Outlet} from "react-router-dom";
import { LuMessagesSquare, LuCat, LuUser } from "react-icons/lu";
import {useState} from "react";

export default function JoinLayout() {

    const [selected, setSelected] = useState('main');
    const selectedClass = page => selected === page ? 'selected' : '';

    return (
        <>
            <div className={'main-pages'}>
                <main className={'scrollable'}>
                    <Outlet context={{ setSelected }}/>
                </main>
                <nav>
                    <Link className={selectedClass('login')} to={'/acc/login'}><LuUser /></Link>
                    <Link className={selectedClass('register')} to={'/acc/profile'}><LuUser /></Link>
                </nav>
            </div>
        </>
    )
}