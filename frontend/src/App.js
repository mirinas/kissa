import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './styles/App.css';
import JoinLayout from "./pages/JoinLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./pages/MainLayout";
import MainPage from "./pages/MainPage";
import MessagesPage from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import RootPage from "./pages/RootPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ASK TO LOGIN OR REGISTER */}
                <Route index element={<RootPage />}/>

                {/* PAGES FOR LOGIN AND REGISTER */}
                <Route path='/acc/' element={<JoinLayout />}>
                    <Route path='login' element={<LoginPage />}/>
                    <Route path='register' element={<RegisterPage />}/>
                </Route>

                {/* MAIN PAGES */}
                <Route path='/app/' element={<MainLayout />}>
                    <Route index element={<MainPage />}/>
                    <Route path='messages' element={<MessagesPage />}/>
                    <Route path='settings' element={<SettingsPage />}/>
                </Route>
                <Route path="/*" element={<NotFoundPage />}/>
            </Routes>
        </BrowserRouter>
    );
}
