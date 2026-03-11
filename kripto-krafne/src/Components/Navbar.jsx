import Logo from '../assets/img/logo.png';
import { useState, useEffect } from 'react';
import Krafnapfp from "../assets/img/krafna.png";
import { Link } from 'react-router-dom';

function Navbar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = () => {
        fetch("http://localhost/backend/session.php", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Session data:', data); // Debug log
                if (data.authenticated) {
                    setUser({
                        id: data.user_id,
                        username: data.username,
                        isAdmin: data.is_admin
                    });
                } else {
                    setUser(null);
                }
            })
            .catch((err) => {
                console.error("Session check error:", err);
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogout = () => {
        fetch("http://localhost/backend/logout.php", {
            method: "POST",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Logout response:', data);
                sessionStorage.clear();
                setUser(null);
                window.location.href = '/';
            })
            .catch((err) => {
                console.error("Logout error:", err);
            });
    };

    return (
        <div className='body'>
            <div className="navbar bg-pink-300 p-2 flex flex-row justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="w-22 h-18" />
                    <Link to="/" className="text-white font-bold title-font small">Kripto Krafne</Link>
                </div>

                {loading ? (
                    <div className="text-white text-sm">Loading...</div>
                ) : user ? (
                    // Logged in - show profile dropdown
                    <div id="profile-section">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn-ghost btn-circle avatar cursor-pointer">
                                <div className="w-10 rounded-full">
                                    <img className="w-[50px]" src={Krafnapfp} alt="Profile" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-pink-500 rounded-box z-[100] mt-3 w-52 p-2 text-[15px] font-bold shadow">
                                <li className="text-white px-3 py-2 border-b border-pink-400">
                                    <span className="cursor-default hover:bg-transparent">
                                        👋 {user.username}
                                    </span>
                                </li>
                                <li>
                                    <Link to="/teams" className="text-white hover:bg-pink-600">
                                        🏆 My Team
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/leaderboard" className="text-white hover:bg-pink-600">
                                        📊 Leaderboard
                                    </Link>
                                </li>
                                {user.isAdmin && (
                                    <li>
                                        <Link to="/admin" className="text-white hover:bg-pink-600">
                                            ⚙️ Admin Panel
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <a onClick={handleLogout} className="text-white hover:bg-pink-600 cursor-pointer">
                                        🚪 Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // Not logged in - show login/signup buttons
                    <div className="flex flex-row gap-4" id="auth-buttons">
                        <Link to="/signup" className="bg-pink-500 text-white italic px-6 py-2 rounded-full shadow-md hover:bg-pink-600 transition-all">
                            SignUp
                        </Link>
                        <Link to="/login" className="bg-pink-500 text-white italic px-6 py-2 rounded-full shadow-md hover:bg-pink-600 transition-all">
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;