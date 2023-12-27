import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './styles/App.css';

export default function App() {

    const API_ENDPOINT = process.env.REACT_APP_KISSA_API_ENDPOINT || 'http://localhost:8080';

    return (
        <BrowserRouter>
            <Routes>
                {/* ASK TO LOGIN OR REGISTER */}
                <Route index element={<Index />}/>

                {/* PAGES FOR LOGIN AND REGISTER */}
                <Route path='/acc/' element={<JoinPage/>}>
                    <Route path='login' element={<LoginPage />}/>
                    <Route path='register' element={<RegisterPage />}/>
                </Route>

                {/* MAIN PAGES */}
                <Route path='/app/' element={<Application />}>
                    <Route index element={<MainScreen />}/>
                    <Route path='messages' element={<Messages />}/>
                    <Route path='settings' element={<Settings />}/>
                </Route>
                <Route path="/*" element={<NoPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}
