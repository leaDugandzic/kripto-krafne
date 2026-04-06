import { useState, useEffect } from 'react';

const TeamDashboard = () => {
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/get_user_team.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success && data.in_team) {
                setTeamData(data);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!teamData) return <div>You are not in a team.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-purple-800">Team Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Info Card */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{teamData.team.name}</h2>
                            <p className="text-lg text-purple-600 font-semibold">Score: {teamData.team.score} points</p>
                            <p className="text-gray-600">Rank: #1</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Created</p>
                            <p>{new Date(teamData.team.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Progress</span>
                            <span className="font-semibold">
                                {teamData.progress.length}/6 tasks completed
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${(teamData.progress.length / 6) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Tasks Grid */}
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Tasks Progress</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(taskNum => {
                            const task = teamData.progress.find(p => p.task_number === taskNum);
                            return (
                                <div key={taskNum} className={`p-4 rounded-lg border-2 ${task ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold">Task {taskNum}</p>
                                            <p className="text-sm text-gray-600">
                                                {task ? `Solved by: User ${task.solved_by_user_id}` : 'Pending'}
                                            </p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            <span className="text-white font-bold">
                                                {task ? '✓' : taskNum}
                                            </span>
                                        </div>
                                    </div>
                                    {task && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Solved: {new Date(task.solved_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Team Members Sidebar */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Team Members</h3>
                    <div className="space-y-4">
                        {teamData.members.map(member => (
                            <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.is_captain ? 'bg-yellow-100' : 'bg-purple-100'}`}>
                                    <span className={`font-bold ${member.is_captain ? 'text-yellow-600' : 'text-purple-600'}`}>
                                        {member.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{member.username}</p>
                                    <p className="text-sm text-gray-600">
                                        {member.is_captain ? '👑 Team Captain' : 'Member'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Joined: {new Date(member.joined_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-bold mb-3 text-gray-800">Quick Stats</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{teamData.progress.length}</p>
                                <p className="text-sm text-gray-600">Tasks Solved</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{teamData.members.length}</p>
                                <p className="text-sm text-gray-600">Team Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;