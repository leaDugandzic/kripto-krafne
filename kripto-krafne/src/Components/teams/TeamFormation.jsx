import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamFormation = () => {
    const [teamName, setTeamName]           = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userTeam, setUserTeam]           = useState(null);
    const [invitations, setInvitations]     = useState([]);
    const [message, setMessage]             = useState('');
    const [loading, setLoading]             = useState(true);
    const [isAdmin, setIsAdmin]             = useState(false);
    const [pendingInvite, setPendingInvite] = useState(null); // for popup

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/session.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.is_admin) {
                setIsAdmin(true);
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error('Session check failed:', err);
        }
        fetchUserTeam();
    };

    const fetchUserTeam = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/get_user_team.php', {
                credentials: 'include'
            });
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch {
                setMessage('Server error – please check you are logged in');
                setLoading(false);
                return;
            }

            if (data.success) {
                if (data.in_team) {
                    setUserTeam(data);
                    setInvitations([]);
                    setMessage('');
                } else {
                    setUserTeam(null);
                    const inv = data.invitations || [];
                    setInvitations(inv);
                    // Show popup for first pending invite
                    if (inv.length > 0) setPendingInvite(inv[0]);
                    setMessage('');
                }
            } else {
                if (response.status === 401) {
                    setMessage('Please log in to access team features');
                } else {
                    setMessage(data.message || 'Error loading team data');
                }
            }
        } catch (error) {
            setMessage('Network error – make sure XAMPP is running');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) { setMessage('Please enter a team name'); return; }
        setLoading(true);
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/create_team.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_name: teamName })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) { fetchUserTeam(); setTeamName(''); }
        } catch { setMessage('Error creating team'); }
        finally { setLoading(false); }
    };

    const handleSearchUsers = async () => {
        if (!searchUsername.trim()) return;
        try {
            const response = await fetch(
                `http://localhost/kripto-krafne/kripto-krafne/src/backend/search.php?q=${encodeURIComponent(searchUsername)}`,
                { credentials: 'include' }
            );
            const data = await response.json();
            setSearchResults(data.users || []);
            if ((data.users || []).length === 0) setMessage('No users found');
        } catch { setMessage('Error searching for users'); }
    };

    const handleInvite = async (username) => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/invite.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to_username: username, team_id: userTeam.team.id })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) { fetchUserTeam(); setSearchResults([]); setSearchUsername(''); }
        } catch { setMessage('Error sending invitation'); }
    };

    const handleInvitationResponse = async (invitationId, accept) => {
        setPendingInvite(null); // close popup
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/accept_invitation.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invitation_id: invitationId, accept })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) fetchUserTeam();
        } catch { setMessage('Error responding to invitation'); }
    };

    const handleLeaveTeam = async () => {
        if (!confirm('Are you sure you want to leave the team?')) return;
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/leave_team.php', {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) fetchUserTeam();
        } catch { setMessage('Error leaving team'); }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const isCaptain = userTeam?.members?.some(
        m => m.is_captain && (m.id === userTeam?.currentUserId)
    ) || userTeam?.team?.is_captain;

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading team information…</p>
            </div>
        );
    }

    // ── Admin guard ───────────────────────────────────────────────────────────
    if (isAdmin) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
                    <p className="text-4xl mb-4">🔒</p>
                    <h2 className="text-xl font-bold text-purple-800 mb-2">Admin Account</h2>
                    <p className="text-gray-600">
                        Admins cannot create or join teams. Use the{' '}
                        <a href="/admin" className="text-purple-600 underline font-semibold">Admin Panel</a>{' '}
                        to manage all teams.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-purple-800">Team Formation</h1>

            {/* ── Invitation Popup ─────────────────────────────────────────── */}
            <AnimatePresence>
                {pendingInvite && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
                        >
                            <p className="text-5xl mb-4">📨</p>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Invitation</h2>
                            <p className="text-gray-600 mb-1">
                                You have been invited to join
                            </p>
                            <p className="text-xl font-bold text-purple-700 mb-1">
                                {pendingInvite.team_name}
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Invited by: {pendingInvite.from_user}
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => handleInvitationResponse(pendingInvite.id, true)}
                                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    ✅ Accept
                                </button>
                                <button
                                    onClick={() => handleInvitationResponse(pendingInvite.id, false)}
                                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    ❌ Decline
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status message */}
            {message && (
                <div className={`p-4 mb-6 rounded-lg flex justify-between items-center ${
                    message.toLowerCase().includes('success') || message.toLowerCase().includes('created') || message.toLowerCase().includes('joined')
                        ? 'bg-green-100 text-green-800'
                        : message.toLowerCase().includes('log in') || message.toLowerCase().includes('authenticated')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    <span>{message}</span>
                    <button onClick={() => setMessage('')} className="font-bold ml-4">✕</button>
                </div>
            )}

            {/* ── NOT IN A TEAM ─────────────────────────────────────────────── */}
            {!userTeam ? (
                <div className="max-w-2xl mx-auto">
                    {/* Create Team */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Team</h2>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
                                placeholder="Enter your team name"
                                maxLength={50}
                                className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateTeam}
                                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Create Team
                            </motion.button>
                        </div>
                        <p className="mt-3 text-gray-500 text-sm">Max 4 members · Team name must be unique</p>
                    </div>

                    {/* Pending Invitations list */}
                    {invitations.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                                Pending Invitations ({invitations.length})
                            </h2>
                            <div className="space-y-4">
                                {invitations.map((inv) => (
                                    <div key={inv.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Team: <span className="text-purple-700">{inv.team_name}</span></p>
                                            <p className="text-gray-600 text-sm">From: {inv.from_user}</p>
                                            <p className="text-gray-400 text-xs">{new Date(inv.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleInvitationResponse(inv.id, true)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleInvitationResponse(inv.id, false)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* ── IN A TEAM ─────────────────────────────────────────────── */
                <div className="max-w-4xl mx-auto">
                    {/* Team Info */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Team: {userTeam.team.name}
                                </h2>
                                <p className="text-gray-600">Score: <span className="font-bold text-purple-700">{userTeam.team.score || 0}</span> points</p>
                                <p className="text-gray-500 text-sm">Created: {new Date(userTeam.team.created_at).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={handleLeaveTeam}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
                            >
                                Leave Team
                            </button>
                        </div>

                        {/* Members */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                                Team Members ({userTeam.members.length}/4)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userTeam.members.map((member) => {
                                    const displayName = member.username || member.ime || 'Unknown';
                                    return (
                                        <div key={member.id} className="p-4 border border-gray-200 rounded-lg flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                member.is_captain ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{displayName}</p>
                                                <p className="text-sm text-gray-500">{member.is_captain ? '👑 Captain' : 'Member'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Captain: invite section */}
                        {isCaptain && userTeam.members.length < 4 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Invite New Members</h3>
                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        value={searchUsername}
                                        onChange={(e) => setSearchUsername(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
                                        placeholder="Search by username"
                                        className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={handleSearchUsers}
                                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="space-y-2">
                                        {searchResults.map((user) => (
                                            <div key={user.id} className="p-3 border border-gray-200 rounded-lg flex justify-between items-center">
                                                <span className="font-semibold">{user.username}</span>
                                                <button
                                                    onClick={() => handleInvite(user.username)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                                                >
                                                    Invite
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Sent invitations */}
                                {userTeam.sent_invitations?.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-bold mb-2 text-gray-700">Sent Invitations</h4>
                                        <div className="space-y-2">
                                            {userTeam.sent_invitations.map((inv) => (
                                                <div key={inv.id} className="p-3 border border-gray-200 rounded-lg flex justify-between text-sm">
                                                    <span>Invited: <strong>{inv.to_user}</strong></span>
                                                    <span className="text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isCaptain && userTeam.members.length >= 4 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 font-semibold">
                                Team is full (4/4 members)
                            </div>
                        )}
                    </div>

                    {/* Team Progress */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                            Task Progress ({userTeam.progress?.length || 0}/6)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((taskNum) => {
                                const task = userTeam.progress?.find(p => p.task_number === taskNum);
                                return (
                                    <div key={taskNum} className={`p-4 border-2 rounded-lg text-center ${task ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                                        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 font-bold ${task ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            {task ? '✓' : taskNum}
                                        </div>
                                        <p className="font-semibold">Task {taskNum}</p>
                                        <p className="text-xs text-gray-500">
                                            {task ? `Solved ${new Date(task.solved_at).toLocaleDateString()}` : 'Not solved'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamFormation;