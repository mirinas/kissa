import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINT } from '../globals';
import '../styles/LoginRegister.css';


const cookie = new Cookies();
const expiryCheckInterval = 6000;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const isExpired = (exp) => {
        const currentTime = Math.floor(Date.now()/1000);

        //console.log("Current time: " + currentTime);
        //console.log("Expiry: " + exp);

        if (exp && currentTime > exp) {
            cookie.remove("access_token");
            navigate('/acc/login');
        
            console.log("Logged out, cookie has expired - please log in again.");
        }
    }

    const handleLogin = async (event) => {

        event.preventDefault();
        try {
            const response = await fetch(API_ENDPOINT + '/profiles/token', {
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
                const token = data.access_token; 
                const decodedToken = jwtDecode(token);
                const exp = decodedToken.exp;

                console.log("Cookie assigned: " + token);
                cookie.set("access_token", token, {
                    path: '/',
                });

                navigate('/app/');

                const intervalId = setInterval(() => {
                    const accessCookie = cookie.get("access_token");
                    if (accessCookie && exp) {
                        isExpired(exp);
                    }
                }, expiryCheckInterval);
                
                return () => {
                    clearInterval(intervalId);                
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            // show error on browser for user?
        }
    };

    return (
        <>
            <div className="login_container">
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
                                <button type="button" className="btn_kissa">Join us</button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
