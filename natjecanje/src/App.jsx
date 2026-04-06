import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CompetitionTimer from "./components/CompetitionTimer";
import TeamFormation from "./components/teams/TeamFormation";
import TeamDashboard from "./components/teams/TeamDashboard";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/admin/AdminPanel";

const donuts = [
  { id: 1, src: "../src/img/yellow-donut.webp", code: "1", position: { top: "70%", left: "15%" } },
  { id: 2, src: "../src/img/brown-drizzle-donut.webp", code: "5", position: { top: "55%", left: "42%" } },
  { id: 3, src: "../src/img/white-dotted-donut.webp", code: "6", position: { top: "65%", left: "70%" } },
  { id: 4, src: "../src/img/blue-donut.webp", code: "4", position: { top: "20%", left: "85%" } },
  { id: 5, src: "../src/img/plain-donut.webp", code: "3", position: { top: "15%", left: "50%" } },
  { id: 6, src: "../src/img/green-donut.webp", code: "2", position: { top: "30%", left: "20%" } },
];

export default function DonutGame() {
  const [inputs, setInputs] = useState(Array(6).fill(""));
  const [validated, setValidated] = useState(Array(6).fill(false));
  const [shake, setShake] = useState(Array(6).fill(false));
  const [userTeam, setUserTeam] = useState(null);
  const [competitionActive, setCompetitionActive] = useState(false);
  const [currentView, setCurrentView] = useState("game"); // game, teams, dashboard, leaderboard, admin

  // Check user team and competition status
  useEffect(() => {
    checkUserTeam();
    checkCompetition();
  }, []);

  const checkUserTeam = async () => {
    try {
      const response = await fetch('http://localhost/backend/teams/get_user_team.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success && data.in_team) {
        setUserTeam(data);
      }
    } catch (error) {
      console.error('Error checking team:', error);
    }
  };

  const checkCompetition = async () => {
    try {
      const response = await fetch('http://localhost/backend/competition_status.php', {
        credentials: 'include'
      });
      const data = await response.json();
      setCompetitionActive(data.is_active);
    } catch (error) {
      console.error('Error checking competition:', error);
    }
  };

  const handleValidation = async (index) => {
    // Team check
    if (!userTeam) {
      alert("You must join a team before submitting codes! Go to Teams page.");
      setCurrentView("teams");
      return;
    }

    // Competition check
    if (!competitionActive) {
      alert("Competition has not started yet. Wait for admin to start.");
      return;
    }

    const taskNumber = index + 1;
    const code = inputs[index];

    try {
      const response = await fetch('http://localhost/backend/ctf/submit_task.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_number: taskNumber, code })
      });

      const data = await response.json();

      if (data.success) {
        const newValidated = [...validated];
        newValidated[index] = true;
        setValidated(newValidated);
        
        // Update team score display
        checkUserTeam();
        
        alert(`✅ ${data.message}\nTeam Score: ${data.team_score}\nTasks Solved: ${data.tasks_solved}/6`);
      } else {
        setShake(prev => {
          const newShake = [...prev];
          newShake[index] = true;
          return newShake;
        });
        setTimeout(() => {
          setShake(prev => {
            const newShake = [...prev];
            newShake[index] = false;
            return newShake;
          });
        }, 500);
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      alert("Error submitting code. Please try again.");
    }
  };

  // Navigation
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-40 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-6">
            <button onClick={() => setCurrentView("game")} className={`font-semibold ${currentView === "game" ? "text-purple-600" : "text-gray-600"}`}>
              🍩 Game
            </button>
            <button onClick={() => setCurrentView("teams")} className={`font-semibold ${currentView === "teams" ? "text-purple-600" : "text-gray-600"}`}>
              👥 Teams
            </button>
            {userTeam && (
              <button onClick={() => setCurrentView("dashboard")} className={`font-semibold ${currentView === "dashboard" ? "text-purple-600" : "text-gray-600"}`}>
                📊 Dashboard
              </button>
            )}
            <button onClick={() => setCurrentView("leaderboard")} className={`font-semibold ${currentView === "leaderboard" ? "text-purple-600" : "text-gray-600"}`}>
              🏆 Leaderboard
            </button>
            {/* Admin button would be conditional based on user role */}
          </div>
          
          {userTeam && (
            <div className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              Team: {userTeam.team.name} | Score: {userTeam.team.score}
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  // Render different views
  const renderView = () => {
    switch(currentView) {
      case "teams":
        return <TeamFormation />;
      case "dashboard":
        return userTeam ? <TeamDashboard /> : <div className="container mx-auto px-4 py-8">Join a team first!</div>;
      case "leaderboard":
        return <Leaderboard />;
      case "admin":
        return <AdminPanel />;
      case "game":
      default:
        return (
          <div className="relative w-full h-screen bg-[#ffceea] flex items-center justify-center overflow-hidden p-8 md:p-12 pt-20">
            {/* Competition status banner */}
            {!competitionActive && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg">
                ⏳ Competition Paused - Wait for admin to start
              </div>
            )}
            
            {!userTeam && (
              <div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-30 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                👥 Join a team to start competing!
              </div>
            )}

            {donuts.map((donut, index) => (
              <div
                key={donut.id}
                className="absolute flex flex-col items-center"
                style={{ top: donut.position.top, left: donut.position.left }}
              >
                <motion.img
                  src={donut.src}
                  alt="Donut"
                  className="w-28 md:w-38 cursor-pointer hover:scale-110 transition-transform"
                  animate={validated[index] ? { rotate: 360 } : {}}
                  transition={{ duration: 1 }}
                  onClick={() => {
                    // When donut is clicked, show the corresponding task
                    // You'll need to implement this based on your task system
                    alert(`Task ${index + 1} - Clicking donuts shows the task!`);
                  }}
                />
                <div className="flex items-center bg-white p-2 md:p-3 rounded-full border-4 border-[#ff0080] shadow-md mt-2">
                  <motion.input
                    type="text"
                    value={inputs[index]}
                    onChange={(e) => {
                      const newInputs = [...inputs];
                      newInputs[index] = e.target.value;
                      setInputs(newInputs);
                    }}
                    className={`p-2 md:p-3 border-4 rounded-full bg-[#f4e8df] w-16 md:w-28 text-center text-lg font-bold outline-none border-[#ff0080] ${
                      validated[index] ? "bg-green-200" : ""
                    } ${!userTeam || !competitionActive ? "opacity-50 cursor-not-allowed" : ""}`}
                    animate={shake[index] ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.2 }}
                    disabled={!userTeam || !competitionActive}
                    placeholder="Code"
                  />
                  <button
                    onClick={() => handleValidation(index)}
                    className={`bg-[#ff0080] text-white px-4 md:px-5 py-2 md:py-4 rounded-full shadow-md ml-2 text-lg ${
                      !userTeam || !competitionActive ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff3399]"
                    }`}
                    disabled={!userTeam || !competitionActive}
                    title={!userTeam ? "Join a team first" : !competitionActive ? "Wait for competition to start" : "Submit code"}
                  >
                    🔑
                  </button>
                </div>
                <div className="mt-1 text-sm font-semibold">
                  Task {index + 1}
                  {validated[index] && " ✓"}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="relative">
      <CompetitionTimer />
      <Navigation />
      {renderView()}
    </div>
  );
}