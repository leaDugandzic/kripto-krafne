import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Logo from './assets/img/logo.png';
import Level from './Components/Level';
import DonutLevel from './Components/DonutLevel';

function App() {
  return (
    <div>
      <Router>
        <div className="bg-pink-300 p-2 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-22 h-18" />
            <Link to="/" className="text-white font-bold italic text-lg">Kripto Krafne</Link>
          </div>
          <Link to="/login" className="bg-pink-500 text-white italic px-4 py-2 rounded-full shadow-md hover:bg-pink-600 transition">
            SignUp/Login
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/box/:id/level/:levelId" element={<Level />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
