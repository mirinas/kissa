import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

export default function RootPage() {
    const cookie = new Cookies();
    const accessToken = cookie.get('access_token');
    const navigate = useNavigate();

    if (accessToken) {
        setTimeout(() => navigate('/app/'), 0);
        return null;
    }

    const goToLogin = () => {
        navigate('/acc/login');
    }

    const goToRegister = () => {
        navigate('/acc/register');
    }

    return (
        <div className='center_div'>
            <button className="btn_kissa" onClick={goToLogin}>Login</button>
            <button className="btn_kissa" onClick={goToRegister}>Join us</button>
        </div>
    );
}