import { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [teams, setTeams] = useState([]);
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (competition?.is_active && competition.time_remaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [competition]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://localhost/backend/leaderboard.php?limit=20', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setTeams(data.teams);
                setCompetition(data.competition);
                if (data.competition?.is_active && data.competition.end_time) {
                    const endTime = new Date(data.competition.end_time).getTime();
                    const now = new Date().getTime();
                    setTimeRemaining(Math.max(0, Math.floor((endTime - now) / 1000)));
                }
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-600">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-purple-800">CTF Leaderboard</h1>
            
            {/* Competition Status Banner */}
            <div className="mb-8">
                {competition?.is_active ? (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Competition Active! 🏆</h2>
                                <p className="mt-1">Solve tasks to earn points for your team</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-center">
                                <div className="text-3xl font-bold font-mono">
                                    {formatTime(timeRemaining)}
                                </div>
                                <p className="text-sm opacity-90">Time Remaining</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Competition Paused</h2>
                            <p className="mt-1">Waiting for admin to start the competition</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Rank</th>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Team</th>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Score</th>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Tasks</th>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Members</th>
                                <th className="py-4 px-6 text-left font-semibold text-gray-700">Last Solve</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {teams.length > 0 ? (
                                teams.map((team, index) => (
                                    <tr 
                                        key={team.id} 
                                        className={`hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                                                {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                                                {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                                                {index >= 3 && (
                                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold">
                                                        #{index + 1}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-bold text-lg text-gray-800">{team.team_name}</p>
                                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                                    Members: {team.members}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-xl text-purple-600">
                                                {team.score}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-1">pts</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${(team.tasks_solved / 6) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-semibold">
                                                    {team.tasks_solved}/6
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex -space-x-2">
                                                {team.members.split(', ').slice(0, 3).map((member, i) => (
                                                    <div 
                                                        key={i}
                                                        className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center"
                                                        title={member}
                                                    >
                                                        <span className="text-xs font-bold text-purple-600">
                                                            {member.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                ))}
                                                {team.member_count > 3 && (
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                                                        <span className="text-xs font-bold text-gray-600">
                                                            +{team.member_count - 3}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {team.last_solved ? (
                                                <>
                                                    {new Date(team.last_solved).toLocaleDateString()}
                                                    <br/>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(team.last_solved).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </>
                                            ) : (
                                                'No solves yet'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                        No teams have joined the competition yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Last Updated */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Showing {teams.length} teams</span>
                        <span>Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                        <div>
                            <p className="font-semibold">Top 3 Teams</p>
                            <p className="text-sm text-gray-600">Special background highlight</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <div>
                            <p className="font-semibold">Progress Bar</p>
                            <p className="text-sm text-gray-600">Shows tasks completed (max 6)</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-purple-600">A</span>
                        </div>
                        <div>
                            <p className="font-semibold">Team Members</p>
                            <p className="text-sm text-gray-600">Initials shown for each member</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;