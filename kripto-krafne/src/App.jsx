import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Level from './Components/Level';
import DonutLevel from './Components/DonutLevel';
import Signup from './Components/Signup';
import { useState, useEffect } from 'react';
import levels from './library/levels.json';
import Images from './KraljestvoKrafni/Images'
import Radnici from './KraljestvoKrafni/Radnici';
import Glazba from './KraljestvoKrafni/Glazba';
import Menu from './KraljestvoKrafni/Menu';
import Kolo from './KraljestvoKrafni/Kolo';
import DonutRecipe from './KraljestvoKrafni/DonutRecipe';
import Footer from "./Components/Footer";
import DragDrop from '../src/KraljestvoKrafni/DragDrop';
import DonutGame from './KraljestvoKrafni/DonutGame';
import AIChatbot from './Components/AiChatbot';
import chatbotIcon from "./assets/img/chatbotIcon.png";
import Navbar from './Components/Navbar';
import PageDecorations from './Components/PageDecorations';
import Post from './Components/Forum/Post';
import Forums from './Components/Forum/Forums';
import PostLayout from './Components/Forum/PostLayout';
import TeamFormation from './Components/teams/TeamFormation';
import TeamDashboard from './Components/teams/TeamDashBoard';
import Leaderboard from './Components/Leaderboard';
import AdminPanel from './Components/admin/AdminPanel';
import Profile from './Components/Profile';
import CompetitionFeed from './Components/CompetitionFeed';
import AchievementToast from './Components/AchievementToast';
import HallOfFame from './Components/HallOfFame';
import Certificate from './Components/Certificate';
import CertificatePopup from './Components/CertificatePopup';

function App() {
  const [chatbotClick, setChatboxClick] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kk-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('kk-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <div className='app-root' data-theme={theme} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb-pink" aria-hidden="true" />
      <div className="bg-orb bg-orb-purple" aria-hidden="true" />
      <div className="bg-orb bg-orb-yellow" aria-hidden="true" />
      <div className="bg-orb bg-orb-orange" aria-hidden="true" />

      {/* Page-wide decorative shapes */}
      <PageDecorations />

      <Router>
        <CompetitionFeed />
        <AchievementToast />
        <CertificatePopup />
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        {/* Chatbot trigger */}
        <button
          className="chatbot-trigger"
          onClick={() => setChatboxClick(true)}
          aria-label="Open AI assistant"
        >
          <img src={chatbotIcon} alt="" />
        </button>

        {/* Chatbot modal */}
        {chatbotClick && (
          <div className="chatbot-overlay" onClick={(e) => e.target === e.currentTarget && setChatboxClick(false)}>
            <div className="chatbot-overlay-inner">
              <button className="chatbot-close-btn" onClick={() => setChatboxClick(false)} aria-label="Close">
                ×
              </button>
              <AIChatbot onClose={() => setChatboxClick(false)} />
            </div>
          </div>
        )}

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<AIChatbot />} />
            <Route path="/radnici" element={<Radnici />} />
            <Route path="/glazba" element={<Glazba />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/images" element={<Images />} />
            <Route path="/kolo" element={<Kolo />} />
            <Route path="/dragdrop" element={<DragDrop />} />
            <Route path="/recipe/:id" element={<DonutRecipe />} />
            <Route path="/ctf-game" element={<DonutGame />} />
            <Route path="/post" element={<Post />} />
            <Route path="forums" element={<Forums />} />
            <Route path="/box/:id" element={<Level levels={levels} />} />
            <Route path="/donut-level/:id" element={<DonutLevel levels={levels} />} />
            <Route path="/forums/:postid" element={<PostLayout />} />
            <Route path="/teams" element={<TeamFormation />} />
            <Route path="/team-dashboard" element={<TeamDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/certificate" element={<Certificate />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
