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
import Navbar from './Components/Navbar';
import Post from './Components/Forum/Post';
import Forums from './Components/Forum/Forums';
function App() {
  
  const[chatbotClick, setChatboxClick] = useState(false);



  return (
    <div className='body'>

      <Router>
      <Navbar></Navbar>
      
        <div onClick={()=>setChatboxClick(true)}className='fixed bottom-0 right-0 flex items-center justify-center p-[20px] hover:scale-110 transition-transform duration-300 ease-in-out'>
          <img src={chatbotIcon} className='w-[100px]'></img>
        </div>
           {chatbotClick && (
      <div className="fixed inset-0 flex items-center justify-center z-10 0 bg-[#0000004f]">
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
          <Route path="/post" element={<Post/>}></Route>
          <Route path="forums" element={<Forums></Forums>}></Route>
          <Route path="/box/:id" element={<Level levels={levels} />} />
          <Route path="/donut-level/:id" element={<DonutLevel levels={levels} />} />
        </Routes>
        <Footer></Footer>

      </Router>
    </div>
  )
}

export default App
