import { Outlet } from "react-router-dom";

export default function JoinLayout() {
    return (
        <>
            {/* <Link to={'/acc/login'}>Login</Link>
            <Link to={'/acc/register'}>Register</Link>
            <p>Layout, components, functions common for both logging in and registering</p>
            <hr/> */}
            <Outlet />
        </>
    )
}