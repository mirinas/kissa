import {Link, Outlet} from "react-router-dom";

export default function MainLayout() {
    return (
        <>
            <Link to={'/app/'}>Main Page</Link>
            <Link to={'/app/messages'}>Messages</Link>
            <Link to={'/app/settings'}>Settings</Link>
            <p>Layout, components, functions common for main screens</p>
            <hr/>
            <Outlet />
        </>
    )
}