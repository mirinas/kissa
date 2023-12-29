import {Link} from "react-router-dom";

export default function Root() {
    return (
        <>
            <Link to={'/acc/login'}>Login</Link>
            <Link to={'/acc/register'}>Register</Link>
            <p>Maybe check for saved session to skip login process here</p>
        </>
    );
}