import { Link } from 'react-router-dom';
import '../styles/RootPage.css';

export default function RootPage() {
    return (

        <div className="landing_title">
                <h1 className="cursive">Find your purrrfect match</h1>
                <div className="buttons_center">
                    <div className="buttons_backdrop">
                        <Link to="/login">
                            <button className="btn_kissa">Log In</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn_kissa">Join Us</button>
                        </Link>
                    </div>
                </div>
        </div>
    );
}
