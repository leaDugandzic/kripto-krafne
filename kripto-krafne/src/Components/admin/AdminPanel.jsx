import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [competition, setCompetition]       = useState(null);
    const [duration, setDuration]             = useState(24);
    const [loading, setLoading]               = useState(false);
    const [message, setMessage]               = useState('');
    const [isAdmin, setIsAdmin]               = useState(false);
    const [checkingAuth, setCheckingAuth]     = useState(true);
    const [teams, setTeams]                   = useState([]);
    const [teamsLoading, setTeamsLoading]     = useState(false);
    const [expandedTeam, setExpandedTeam]     = useState(null);
    const [activeTab, setActiveTab]           = useState('control'); // 'control' | 'teams'
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/session.php', {
                credentials: 'include'
            });
            const data = await response.json();

            if (!data.authenticated || !data.is_admin) {
                setMessage('Admin access required. Redirecting to login…');
                setIsAdmin(false);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setIsAdmin(true);
                fetchCompetitionStatus();
            }
        } catch (error) {
            setMessage('Error checking authentication');
            setIsAdmin(false);
        } finally {
            setCheckingAuth(false);
        }
    };

    const fetchCompetitionStatus = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/competition_status.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) setCompetition(data);
        } catch (error) {
            console.error('Error fetching competition status:', error);
        }
    };

    const fetchAllTeams = async () => {
        setTeamsLoading(true);
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/admin_teams.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) setTeams(data.teams);
            else setMessage(data.message);
        } catch (error) {
            setMessage('Error loading teams');
        } finally {
            setTeamsLoading(false);
        }
    };

    const handleStartCompetition = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/start_competition.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration_hours: duration, start_now: true })
            });
            const data = await response.json();
            setMessage(data.message || (data.success ? 'Competition started!' : 'Error'));
            if (data.success) fetchCompetitionStatus();
        } catch {
            setMessage('Network error starting competition');
        } finally {
            setLoading(false);
        }
    };

    const handleEndCompetition = async () => {
        if (!window.confirm('Are you sure you want to end the competition?')) return;
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/end_competition.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setMessage(data.message || (data.success ? 'Competition ended' : 'Error'));
            if (data.success) fetchCompetitionStatus();
        } catch {
            setMessage('Network error ending competition');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeam = async (teamId, teamName) => {
        if (!window.confirm(`Delete team "${teamName}"? This cannot be undone.`)) return;
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/admin_teams.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_team', team_id: teamId })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) fetchAllTeams();
        } catch {
            setMessage('Error deleting team');
        }
    };

    const handleBanPlayer = async (userId, username, isBanned) => {
        const action = isBanned ? 'unban_player' : 'ban_player';
        const verb   = isBanned ? 'Unban'       : 'Ban';
        if (!window.confirm(`${verb} player "${username}"?`)) return;
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/admin_teams.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, user_id: userId })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) fetchAllTeams();
        } catch {
            setMessage('Error banning/unbanning player');
        }
    };

    // ── Loading / access-denied guards ──────────────────────────────────────
    if (checkingAuth) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Checking admin access…</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Access Denied</p>
                    <p>{message}</p>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────────────
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Admin Panel</h1>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-8 justify-center">
                <button
                    onClick={() => { setActiveTab('control'); fetchCompetitionStatus(); }}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        activeTab === 'control'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                >
                    🏁 Competition Control
                </button>
                <button
                    onClick={() => { setActiveTab('teams'); fetchAllTeams(); }}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        activeTab === 'teams'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                >
                    👥 All Teams
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="px-6 py-2 rounded-lg font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                    📊 Leaderboard
                </button>
            </div>

            {/* Global message */}
            {message && (
                <div className={`p-4 mb-6 rounded-lg ${
                    message.toLowerCase().includes('success') || message.toLowerCase().includes('started') || message.toLowerCase().includes('ended')
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                    <button
                        onClick={() => setMessage('')}
                        className="float-right font-bold"
                    >✕</button>
                </div>
            )}

            {/* ── COMPETITION CONTROL TAB ────────────────────────────────── */}
            {activeTab === 'control' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Competition Control</h2>

                        {competition?.is_active ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold text-green-700">COMPETITION ACTIVE</span>
                                    </div>
                                    <p className="text-gray-700">
                                        Started: {new Date(competition.competition.start_time).toLocaleString()}
                                    </p>
                                    <p className="text-gray-700">
                                        Ends: {new Date(competition.competition.end_time).toLocaleString()}
                                    </p>
                                    <p className="text-lg font-bold text-green-600 mt-2">
                                        Time remaining: {Math.floor(competition.time_remaining / 3600)}h{' '}
                                        {Math.floor((competition.time_remaining % 3600) / 60)}m
                                    </p>
                                </div>

                                <button
                                    onClick={handleEndCompetition}
                                    disabled={loading}
                                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Processing…' : '🛑 End Competition'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-700 font-semibold">No active competition</p>
                                    <p className="text-sm text-yellow-600 mt-1">Start a new competition to enable team participation</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Competition Duration (hours)
                                    </label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="1">1 hour</option>
                                        <option value="2">2 hours</option>
                                        <option value="4">4 hours</option>
                                        <option value="8">8 hours</option>
                                        <option value="24">24 hours (default)</option>
                                        <option value="48">48 hours</option>
                                        <option value="72">72 hours</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleStartCompetition}
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Starting…' : '🚀 Start Competition Now'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* How-to guide */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 self-start">
                        <h3 className="text-xl font-bold mb-4 text-blue-900">How to Use</h3>
                        <ol className="list-decimal list-inside space-y-2 text-blue-800">
                            <li>Select competition duration</li>
                            <li>Click <strong>Start Competition Now</strong></li>
                            <li>The popup on the home page will appear for all users automatically</li>
                            <li>Teams can now participate and solve challenges</li>
                            <li>Monitor progress on the Leaderboard tab</li>
                            <li>Click <strong>End Competition</strong> when done</li>
                        </ol>
                        <div className="mt-4 p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600">Logged in as <strong>Admin</strong></p>
                            <p className="text-xs text-gray-500 mt-1">Admins cannot create or join teams</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ALL TEAMS TAB ──────────────────────────────────────────── */}
            {activeTab === 'teams' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">All Teams ({teams.length})</h2>
                        <button
                            onClick={fetchAllTeams}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {teamsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow">
                            <p className="text-gray-500 text-lg">No teams yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {teams.map((team) => (
                                <div key={team.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    {/* Team header row */}
                                    <div
                                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                                                {team.team_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{team.team_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {team.member_count} member{team.member_count !== 1 ? 's' : ''} · {team.tasks_solved} task{team.tasks_solved !== 1 ? 's' : ''} solved
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-purple-600">{team.score} pts</p>
                                                {team.last_solved && (
                                                    <p className="text-xs text-gray-400">
                                                        Last: {new Date(team.last_solved).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id, team.team_name); }}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-semibold"
                                                >
                                                    🗑 Delete
                                                </button>
                                                <span className="text-gray-400">{expandedTeam === team.id ? '▲' : '▼'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded members */}
                                    {expandedTeam === team.id && (
                                        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                                            <h4 className="font-semibold text-gray-700 mb-3">Members</h4>
                                            <div className="space-y-2">
                                                {team.members.map((member) => (
                                                    <div
                                                        key={member.id}
                                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                                member.is_captain ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'
                                                            }`}>
                                                                {member.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">
                                                                    {member.username}
                                                                    {member.is_captain && ' 👑'}
                                                                    {member.is_banned && (
                                                                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1 rounded">BANNED</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-400">{member.email}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleBanPlayer(member.id, member.username, member.is_banned)}
                                                            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                                                member.is_banned
                                                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                                            }`}
                                                        >
                                                            {member.is_banned ? '✅ Unban' : '🚫 Ban'}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;