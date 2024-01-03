import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css';

const cookie = new Cookies();

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (event) => {

        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/profiles/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'username': email,
                    'password': password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            else {
                // Get auth token and make cookie
                const data = await response.json();
                cookie.set("access_token", data.access_token, {
                    path: '/', // sets cookie at root level, make it accessible to all domains

                    // TODO: Set other options like expiration and whatnot
                });

                navigate('/app/');

                console.log('Login Successful, data returned: ', data);
            }
        } catch (error) {
            console.error('Login Error:', error);
            // show error on browser for user?
        }
    };

    return (
        <>
            <div>
                <div>
                    <h1 className="title">kissa</h1>
                    <p className="cursive">Find your purrfect soulmate</p>
                </div>

                <div className="items">
                    <form onSubmit={handleLogin}>
                        <div>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <div id="buttons">
                            <button type="submit" className="btn_kissa">Login</button>
                            <br />
                            <Link to="/acc/register">
                                <button type="button" className="btn_kissa light">Join us</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
