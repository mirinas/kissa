import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './styles/App.css';
import JoinLayout from "./pages/JoinLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./pages/MainLayout";
import MainScreen from "./pages/MainScreen";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Root from "./pages/Root";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ASK TO LOGIN OR REGISTER */}
                <Route index element={<Root />}/>

                {/* PAGES FOR LOGIN AND REGISTER */}
                <Route path='/acc/' element={<JoinLayout />}>
                    <Route path='login' element={<LoginPage />}/>
                    <Route path='register' element={<RegisterPage />}/>
                </Route>

                {/* MAIN PAGES */}
                <Route path='/app/' element={<MainLayout />}>
                    <Route index element={<MainScreen />}/>
                    <Route path='messages' element={<Messages />}/>
                    <Route path='settings' element={<Settings />}/>
                </Route>
                <Route path="/*" element={<NotFound />}/>
            </Routes>
        </BrowserRouter>
    );
}