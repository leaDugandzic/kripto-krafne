import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Logo from './assets/img/logo.png';
import Level from './Components/Level';
import DonutLevel from './Components/DonutLevel';
import Signup from './Components/Signup';
import { useState, useEffect } from 'react';
import Krafnapfp from "./assets/img/krafna.png";
import levels from './library/levels.json';
import Images from './KraljestvoKrafni/Images'
import Radnici from './KraljestvoKrafni/Radnici';
import Glazba from './KraljestvoKrafni/Glazba';
import Menu from './KraljestvoKrafni/Menu';
import Kolo from './KraljestvoKrafni/Kolo';
import DonutRecipe from './KraljestvoKrafni/DonutRecipe';
import Footer from "./Components/Footer";
import DragDrop from '../src/KraljestvoKrafni/DragDrop';
import ReverseEngineeringChallenge from './KraljestvoKrafni/ReverseEngineering';
import DonutGame from './KraljestvoKrafni/DonutGame';
import AIChatbot from './Components/AiChatbot';
import chatbotIcon from "./assets/img/chatbotIcon.png";
function App() {
  const [stylepfp, setStylepfp] = useState("none");
  const [stylebtn, setStylebtn] = useState("flex");
  const[chatbotClick, setChatboxClick] = useState(false);

  
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



  return (
    <div className='body'>

      <Router>

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
                <li><a >Logout</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div onClick={()=>setChatboxClick(true)}className='fixed bottom-0 right-0 flex items-center justify-center p-[20px] hover:scale-110 transition-transform duration-300 ease-in-out'>
          <img src={chatbotIcon} className='w-[100px]'></img>
        </div>
           {chatbotClick && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#0000004f]">
    <div className="relative">
      <button 
        onClick={() => setChatboxClick(false)}
        className="absolute right-0 top-0  bg-white text-gray-800 text-4xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors z-10 shadow-lg"
      >
        ×
      </button>
      <AIChatbot onClose={() => setChatboxClick(false)} />
    </div>
  </div>
)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
<Route path="/chat" element={<AIChatbot />} />
          <Route path="/radnici" element={<Radnici></Radnici>}></Route>
          <Route path="/glazba" element={<Glazba></Glazba>}></Route>
          <Route path="/menu" element={<Menu></Menu>}></Route>
          <Route path="/images" element={<Images />}></Route>
          <Route path="/kolo" element={<Kolo></Kolo>}></Route>
          <Route path="/dragdrop" element={<DragDrop />}></Route>
          <Route path="/recipe/:id" element={<DonutRecipe />}></Route>
          <Route path="/ctf-game" element={<DonutGame />} />

          <Route path="/box/:id" element={<Level levels={levels} />} />
          <Route path="/donut-level/:id" element={<DonutLevel levels={levels} />} />
        </Routes>
        <Footer></Footer>

      </Router>
    </div>
  )
}

export default App
