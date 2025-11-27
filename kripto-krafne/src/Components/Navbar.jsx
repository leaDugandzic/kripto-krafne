
import Logo from '../assets/img/logo.png';
import { useState, useEffect } from 'react';
import Krafnapfp from "../assets/img/krafna.png";
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Navbar() {
    const [stylepfp, setStylepfp] = useState("none");
    const [stylebtn, setStylebtn] = useState("flex");


    useEffect(() => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/session.php", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.loggedIn) {
                    setStylepfp("block");
                    setStylebtn("none");
                }
            })
            .catch((err) => console.error("Session check error:", err));
    }, []);

    function Logout(){
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/logout.php", {
            method: "POST",
            credentials: "include",
        }).then((res) => res.json())
            .then((data) => {
                sessionStorage.clear();
                window.location.href = '/'
                setStylepfp("none");
                setStylebtn("block");
            })
    }
    return (
        <div className='body'>


            <div className="navbar bg-pink-300 p-2 flex flex-row justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="w-22 h-18" />
                    <Link to="/" className="text-white font-bold title-font small">Kripto Krafne</Link>
                </div>

                <div className="flex flex-row gap-4" id="buttons" style={{ display: stylebtn }}>
                    <Link to="/signup" className="bg-pink-500 text-white italic px-6 py-2 rounded-full shadow-md hover:bg-pink-600 transition-all">
                        SignUp
                    </Link>
                    <Link to="/login" className="bg-pink-500 text-white italic px-6 py-2 rounded-full shadow-md hover:bg-pink-600 transition-all">
                        Login
                    </Link>
                </div>

                <div id="buttons" style={{ display: stylepfp }}>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img className="w-[50px]" src={Krafnapfp}></img>
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-pink-500 rounded-box z-1 mt-3 w-52 p-2 text-[15px] font-bold shadow">
                            <li><a onClick={Logout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Navbar
