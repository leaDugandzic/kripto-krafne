import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, UserPlus, Search, LogOut, CheckCircle, XCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeamFormation = () => {
    const [teamName, setTeamName]             = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [searchResults, setSearchResults]  = useState([]);
    const [userTeam, setUserTeam]            = useState(null);
    const [invitations, setInvitations]      = useState([]);
    const [message, setMessage]              = useState('');
    const [loading, setLoading]              = useState(true);
    const [isAdmin, setIsAdmin]              = useState(false);
    const [pendingInvite, setPendingInvite]  = useState(null);

    useEffect(() => { checkUserRole(); }, []);

    const checkUserRole = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/session.php', { credentials: 'include' });
            const data = await response.json();
            if (data.is_admin) { setIsAdmin(true); setLoading(false); return; }
        } catch (err) { console.error('Session check failed:', err); }
        fetchUserTeam();
    };

    const fetchUserTeam = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/get_user_team.php', { credentials: 'include' });
            const responseText = await response.text();
            let data;
            try { data = JSON.parse(responseText); } catch { setMessage('Server error – please check you are logged in'); setLoading(false); return; }
            if (data.success) {
                if (data.in_team) { setUserTeam(data); setInvitations([]); setMessage(''); }
                else {
                    setUserTeam(null);
                    const inv = data.invitations || [];
                    setInvitations(inv);
                    if (inv.length > 0) setPendingInvite(inv[0]);
                    setMessage('');
                }
            } else {
                setMessage(response.status === 401 ? 'Please log in to access team features' : data.message || 'Error loading team data');
            }
        } catch { setMessage('Network error – make sure XAMPP is running'); }
        finally { setLoading(false); }
    };

    const handleCreateTeam = async () => {
        if (!teamName.trim()) { setMessage('Please enter a team name'); return; }
        setLoading(true);
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/create_team.php', {
                method: 'POST', credentials: 'include',
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
            const response = await fetch(`http://localhost/kripto-krafne/kripto-krafne/src/backend/search.php?q=${encodeURIComponent(searchUsername)}`, { credentials: 'include' });
            const data = await response.json();
            setSearchResults(data.users || []);
            if ((data.users || []).length === 0) setMessage('No users found');
        } catch { setMessage('Error searching for users'); }
    };

    const handleInvite = async (username) => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/invite.php', {
                method: 'POST', credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to_username: username, team_id: userTeam.team.id })
            });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) { fetchUserTeam(); setSearchResults([]); setSearchUsername(''); }
        } catch { setMessage('Error sending invitation'); }
    };

    const handleInvitationResponse = async (invitationId, accept) => {
        setPendingInvite(null);
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/accept_invitation.php', {
                method: 'POST', credentials: 'include',
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
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/leave_team.php', { method: 'POST', credentials: 'include' });
            const data = await response.json();
            setMessage(data.message);
            if (data.success) fetchUserTeam();
        } catch { setMessage('Error leaving team'); }
    };

    const isCaptain = userTeam?.members?.some(m => m.is_captain && (m.id === userTeam?.currentUserId)) || userTeam?.team?.is_captain;

    const msgType = message.toLowerCase().includes('success') || message.toLowerCase().includes('created') || message.toLowerCase().includes('joined')
        ? 'success' : message.toLowerCase().includes('log in') || message.toLowerCase().includes('authenticated') ? 'warning' : 'error';

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'rotateDonut 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading team information…</p>
                </div>
            </div>
        );
    }

    if (isAdmin) {
        return (
            <div className="page-wrapper">
                <div style={{ maxWidth: 500, margin: '0 auto' }}>
                    <div className="glass-card" style={{ padding: '48px 40px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔒</p>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Admin Account</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
                            Admins cannot create or join teams. Use the Admin Panel to manage all teams.
                        </p>
                        <Link to="/admin">
                            <button className="btn btn-primary">Admin Panel</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Timovi
                    </h1>
                </div>

                {/* Invitation Popup */}
                <AnimatePresence>
                    {pendingInvite && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                                className="glass-card"
                                style={{ padding: '48px 40px', maxWidth: 400, width: '100%', textAlign: 'center' }}
                            >
                                <p style={{ fontSize: '3rem', marginBottom: 16 }}>📨</p>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                                    Pozivnica za tim
                                </h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Pozvani ste da se pridružite timu</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>{pendingInvite.team_name}</p>
                                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: 32 }}>Pozvao/la: {pendingInvite.from_user}</p>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button
                                        onClick={() => handleInvitationResponse(pendingInvite.id, true)}
                                        className="btn btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                    >
                                        <CheckCircle size={16} /> Prihvati
                                    </button>
                                    <button
                                        onClick={() => handleInvitationResponse(pendingInvite.id, false)}
                                        className="btn btn-ghost"
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--error)' }}
                                    >
                                        <XCircle size={16} /> Odbij
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Message banner */}
                {message && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', marginBottom: 24,
                        borderRadius: 'var(--radius-md)',
                        background: msgType === 'success' ? 'rgba(100,220,150,0.1)' : msgType === 'warning' ? 'rgba(255,180,50,0.1)' : 'rgba(255,74,110,0.1)',
                        border: `1px solid ${msgType === 'success' ? 'var(--success)' : msgType === 'warning' ? '#ffb432' : 'var(--error)'}`,
                        color: msgType === 'success' ? 'var(--success)' : msgType === 'warning' ? '#ffb432' : 'var(--error)',
                        fontSize: '0.875rem', fontWeight: 500
                    }}>
                        <span>{message}</span>
                        <button onClick={() => setMessage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Not in a team */}
                {!userTeam ? (
                    <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Create team */}
                        <div className="glass-card" style={{ padding: '32px 36px' }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                                Stvori novi tim
                            </h2>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text" value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                                    placeholder="Ime tima…"
                                    maxLength={50}
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-primary" onClick={handleCreateTeam}>
                                    Stvori
                                </button>
                            </div>
                            <p style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Max 4 člana · Ime tima mora biti jedinstveno
                            </p>
                        </div>

                        {/* Pending invitations list */}
                        {invitations.length > 0 && (
                            <div className="glass-card" style={{ padding: '32px 36px' }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                                    Pozivnice ({invitations.length})
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {invitations.map((inv) => (
                                        <div key={inv.id} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '14px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--glass-border)',
                                            background: 'var(--glass-bg)'
                                        }}>
                                            <div>
                                                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    Tim: <span style={{ color: 'var(--accent)' }}>{inv.team_name}</span>
                                                </p>
                                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Od: {inv.from_user}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-primary" onClick={() => handleInvitationResponse(inv.id, true)} style={{ padding: '6px 14px', fontSize: '0.825rem' }}>Prihvati</button>
                                                <button className="btn btn-ghost" onClick={() => handleInvitationResponse(inv.id, false)} style={{ padding: '6px 14px', fontSize: '0.825rem' }}>Odbij</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* In a team */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Team info */}
                        <div className="glass-card" style={{ padding: '32px 36px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                                <div>
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {userTeam.team.name}
                                    </h2>
                                    <p style={{ color: 'var(--accent)', fontWeight: 700 }}>
                                        {userTeam.team.score || 0} bodova
                                    </p>
                                </div>
                                <button
                                    onClick={handleLeaveTeam}
                                    className="btn btn-ghost"
                                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--error)', borderColor: 'var(--error)', fontSize: '0.825rem' }}
                                >
                                    <LogOut size={14} /> Napusti tim
                                </button>
                            </div>

                            {/* Members */}
                            <div style={{ marginBottom: 28 }}>
                                <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
                                    Članovi ({userTeam.members.length}/4)
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                                    {userTeam.members.map((member) => {
                                        const displayName = member.username || member.ime || 'Unknown';
                                        return (
                                            <div key={member.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                padding: '12px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--glass-bg)',
                                                border: '1px solid var(--glass-border)'
                                            }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                                    background: member.is_captain ? 'rgba(255,180,50,0.2)' : 'var(--accent-soft)',
                                                    border: `1px solid ${member.is_captain ? '#ffb432' : 'var(--accent)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.9rem',
                                                    color: member.is_captain ? '#ffb432' : 'var(--accent)'
                                                }}>
                                                    {displayName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{displayName}</p>
                                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        {member.is_captain ? <><Crown size={10} /> Kapetan</> : 'Član'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Captain: invite */}
                            {isCaptain && userTeam.members.length < 4 && (
                                <div>
                                    <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
                                        Pozovi člana
                                    </h3>
                                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                                        <input
                                            type="text" value={searchUsername}
                                            onChange={(e) => setSearchUsername(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                                            placeholder="Pretraži po korisničkom imenu…"
                                            className="input"
                                            style={{ flex: 1 }}
                                        />
                                        <button className="btn btn-primary" onClick={handleSearchUsers} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Search size={14} /> Traži
                                        </button>
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {searchResults.map((user) => (
                                                <div key={user.id} style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'
                                                }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</span>
                                                    <button className="btn btn-primary" onClick={() => handleInvite(user.username)} style={{ padding: '6px 14px', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <UserPlus size={13} /> Pozovi
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {userTeam.sent_invitations?.length > 0 && (
                                        <div style={{ marginTop: 20 }}>
                                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Poslane pozivnice</p>
                                            {userTeam.sent_invitations.map((inv) => (
                                                <div key={inv.id} style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    fontSize: '0.825rem', color: 'var(--text-secondary)',
                                                    padding: '8px 0', borderBottom: '1px solid var(--glass-border)'
                                                }}>
                                                    <span>Pozvano: <strong>{inv.to_user}</strong></span>
                                                    <span style={{ color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {isCaptain && userTeam.members.length >= 4 && (
                                <div style={{ padding: '14px 16px', background: 'rgba(255,180,50,0.1)', border: '1px solid #ffb432', borderRadius: 'var(--radius-md)', color: '#ffb432', fontWeight: 600, fontSize: '0.875rem' }}>
                                    Tim je pun (4/4 članova)
                                </div>
                            )}
                        </div>

                        {/* Task progress */}
                        <div className="glass-card" style={{ padding: '32px 36px' }}>
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20 }}>
                                Napredak zadataka ({userTeam.progress?.length || 0}/6)
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                                {[1, 2, 3, 4, 5, 6].map((taskNum) => {
                                    const task = userTeam.progress?.find(p => p.task_number === taskNum);
                                    return (
                                        <div key={taskNum} style={{
                                            padding: '16px 12px', textAlign: 'center',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${task ? 'var(--success)' : 'var(--glass-border)'}`,
                                            background: task ? 'rgba(100,220,150,0.08)' : 'var(--glass-bg)'
                                        }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: task ? 'var(--success)' : 'var(--bg-elevated)',
                                                color: task ? 'white' : 'var(--text-muted)',
                                                fontWeight: 700, fontSize: '0.9rem'
                                            }}>
                                                {task ? '✓' : taskNum}
                                            </div>
                                            <p style={{ fontWeight: 600, fontSize: '0.825rem', color: task ? 'var(--success)' : 'var(--text-secondary)' }}>
                                                Zadatak {taskNum}
                                            </p>
                                            {task && (
                                                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                    {new Date(task.solved_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamFormation;
