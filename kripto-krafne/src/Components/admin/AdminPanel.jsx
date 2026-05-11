import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Users, BarChart2, RefreshCw, ChevronDown, ChevronUp, Trash2, Shield, ShieldOff, X } from 'lucide-react';

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
    const [activeTab, setActiveTab]           = useState('control');
    const [durationOpen, setDurationOpen]     = useState(false);
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
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/admin_teams.php', {
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
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/admin_teams.php', {
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
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/teams/admin_teams.php', {
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

    const isSuccess = message && (
        message.toLowerCase().includes('success') ||
        message.toLowerCase().includes('started') ||
        message.toLowerCase().includes('ended')
    );

    // ── Guards ──────────────────────────────────────────────────────────────
    if (checkingAuth) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div style={{
                    width: 48, height: 48,
                    border: '3px solid var(--glass-border)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'rotateDonut 0.8s linear infinite'
                }} />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: 400 }}>
                    <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</p>
                    <h3 style={{ fontWeight: 700, color: 'var(--error)', marginBottom: 8 }}>Pristup odbijen</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────────────
    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: 8
                    }}>
                        Admin Panel
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Upravljanje natjecanjem i timovima
                    </p>
                </div>

                {/* Tab switcher */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                    <button
                        className={`btn ${activeTab === 'control' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setActiveTab('control'); fetchCompetitionStatus(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <Flag size={15} /> Natjecanje
                    </button>
                    <button
                        className={`btn ${activeTab === 'teams' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => { setActiveTab('teams'); fetchAllTeams(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <Users size={15} /> Svi timovi
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => navigate('/leaderboard')}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <BarChart2 size={15} /> Ljestvica
                    </button>
                </div>

                {/* Global message */}
                {message && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 20px',
                        marginBottom: 24,
                        borderRadius: 'var(--radius-md)',
                        background: isSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
                        color: isSuccess ? 'var(--success)' : 'var(--error)',
                        fontSize: '0.875rem', fontWeight: 600
                    }}>
                        <span>{message}</span>
                        <button onClick={() => setMessage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 4 }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* ── COMPETITION CONTROL TAB ──────────────────────────────── */}
                {activeTab === 'control' && (
                    <div className="glass-card" style={{ padding: '32px 36px', maxWidth: 520, margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24
                        }}>
                            Kontrola natjecanja
                        </h2>

                        {competition?.is_active ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{
                                    padding: '18px 20px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(34,197,94,0.08)',
                                    border: '1.5px solid rgba(34,197,94,0.35)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: 'var(--success)',
                                            boxShadow: '0 0 6px var(--success)'
                                        }} />
                                        <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            Natjecanje aktivno
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 4 }}>
                                        Početak: {new Date(competition.competition.start_time).toLocaleString('hr-HR')}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 8 }}>
                                        Kraj: {new Date(competition.competition.end_time).toLocaleString('hr-HR')}
                                    </p>
                                    <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>
                                        Preostalo: {Math.floor(competition.time_remaining / 3600)}h{' '}
                                        {Math.floor((competition.time_remaining % 3600) / 60)}m
                                    </p>
                                </div>

                                <button
                                    onClick={handleEndCompetition}
                                    disabled={loading}
                                    style={{
                                        width: '100%', padding: '13px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(239,68,68,0.12)',
                                        border: '1.5px solid rgba(239,68,68,0.4)',
                                        color: 'var(--error)',
                                        fontWeight: 700, fontSize: '0.925rem',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {loading ? 'Obrađujem…' : 'Završi natjecanje'}
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{
                                    padding: '16px 20px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(234,179,8,0.08)',
                                    border: '1px solid rgba(234,179,8,0.3)'
                                }}>
                                    <p style={{ fontWeight: 600, color: '#ca8a04', fontSize: '0.875rem' }}>
                                        Nema aktivnog natjecanja
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                                        Pokrenite novo natjecanje da omogućite timovima sudjelovanje
                                    </p>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                                        textTransform: 'uppercase', color: 'var(--accent)',
                                        marginBottom: 10
                                    }}>
                                        Trajanje natjecanja
                                    </label>
                                    {/* Custom dropdown */}
                                    <button
                                        type="button"
                                        onClick={() => setDurationOpen(o => !o)}
                                        style={{
                                            width: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '11px 16px',
                                            background: 'var(--glass-bg)',
                                            border: `1.5px solid ${durationOpen ? 'var(--accent)' : 'var(--glass-border)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem', fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s',
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    >
                                        <span>
                                            {[
                                                { v: 1, label: '1 sat' },
                                                { v: 2, label: '2 sata' },
                                                { v: 4, label: '4 sata' },
                                                { v: 8, label: '8 sati' },
                                                { v: 24, label: '24 sata (zadano)' },
                                                { v: 48, label: '48 sati' },
                                                { v: 72, label: '72 sata' },
                                            ].find(o => o.v === duration)?.label}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            style={{
                                                color: 'var(--text-muted)',
                                                transform: durationOpen ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s',
                                                flexShrink: 0
                                            }}
                                        />
                                    </button>
                                    {durationOpen && (
                                        <div style={{
                                            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                                            background: 'var(--bg-elevated)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: 'var(--shadow-lg)',
                                            zIndex: 50, overflow: 'hidden'
                                        }}>
                                            {[
                                                { v: 1,  label: '1 sat',           desc: 'Kratko natjecanje' },
                                                { v: 2,  label: '2 sata',          desc: 'Kratko natjecanje' },
                                                { v: 4,  label: '4 sata',          desc: 'Standardno' },
                                                { v: 8,  label: '8 sati',          desc: 'Standardno' },
                                                { v: 24, label: '24 sata',         desc: 'Preporučeno' },
                                                { v: 48, label: '48 sati',         desc: 'Dugo natjecanje' },
                                                { v: 72, label: '72 sata',         desc: 'Maraton' },
                                            ].map(opt => (
                                                <button
                                                    key={opt.v}
                                                    type="button"
                                                    onClick={() => { setDuration(opt.v); setDurationOpen(false); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        width: '100%', padding: '10px 16px',
                                                        background: duration === opt.v ? 'var(--accent-soft)' : 'transparent',
                                                        color: duration === opt.v ? 'var(--accent)' : 'var(--text-secondary)',
                                                        fontSize: '0.875rem', fontWeight: duration === opt.v ? 700 : 400,
                                                        border: 'none', cursor: 'pointer',
                                                        fontFamily: 'var(--font-body)',
                                                        transition: 'background 0.1s',
                                                        textAlign: 'left'
                                                    }}
                                                    onMouseEnter={e => { if (duration !== opt.v) e.currentTarget.style.background = 'var(--glass-bg)'; }}
                                                    onMouseLeave={e => { if (duration !== opt.v) e.currentTarget.style.background = 'transparent'; }}
                                                >
                                                    <span>{opt.label}</span>
                                                    <span style={{ fontSize: '0.72rem', color: duration === opt.v ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 400 }}>
                                                        {opt.desc}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleStartCompetition}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '13px', fontSize: '0.925rem', opacity: loading ? 0.6 : 1 }}
                                >
                                    {loading ? 'Pokrećem…' : 'Pokreni natjecanje'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── ALL TEAMS TAB ──────────────────────────────────────── */}
                {activeTab === 'teams' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                Svi timovi ({teams.length})
                            </h2>
                            <button
                                className="btn btn-ghost"
                                onClick={fetchAllTeams}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: '0.825rem' }}
                            >
                                <RefreshCw size={14} /> Osvježi
                            </button>
                        </div>

                        {teamsLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                                <div style={{
                                    width: 40, height: 40,
                                    border: '3px solid var(--glass-border)',
                                    borderTopColor: 'var(--accent)',
                                    borderRadius: '50%',
                                    animation: 'rotateDonut 0.8s linear infinite'
                                }} />
                            </div>
                        ) : teams.length === 0 ? (
                            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
                                <Users size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Još nema timova.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {teams.map((team) => (
                                    <div key={team.id} className="glass-card" style={{ overflow: 'hidden' }}>
                                        {/* Team header row */}
                                        <div
                                            style={{
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '18px 24px',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }}
                                            onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div style={{
                                                    width: 38, height: 38, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 800, fontSize: '0.875rem', color: 'white', flexShrink: 0
                                                }}>
                                                    {team.team_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                                        {team.team_name}
                                                    </p>
                                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                        {team.member_count} član{team.member_count !== 1 ? 'ova' : ''} · {team.tasks_solved} zadatak{team.tasks_solved !== 1 ? 'a' : ''} riješeno
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1rem' }}>
                                                    {team.score} pts
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id, team.team_name); }}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 4,
                                                        padding: '6px 12px',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'rgba(239,68,68,0.1)',
                                                        border: '1px solid rgba(239,68,68,0.3)',
                                                        color: 'var(--error)',
                                                        fontSize: '0.78rem', fontWeight: 600,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Trash2 size={13} /> Obriši
                                                </button>
                                                {expandedTeam === team.id
                                                    ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} />
                                                    : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                                                }
                                            </div>
                                        </div>

                                        {/* Expanded members */}
                                        {expandedTeam === team.id && (
                                            <div style={{
                                                borderTop: '1px solid var(--glass-border)',
                                                padding: '18px 24px',
                                                background: 'var(--bg-elevated)'
                                            }}>
                                                <p style={{
                                                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                                                    textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12
                                                }}>
                                                    Članovi
                                                </p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {team.members.map((member) => (
                                                        <div key={member.id} style={{
                                                            display: 'flex', alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '12px 16px',
                                                            borderRadius: 'var(--radius-md)',
                                                            background: 'var(--glass-bg)',
                                                            border: '1px solid var(--glass-border)'
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                                <div style={{
                                                                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                                                    background: member.is_captain
                                                                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                                        : 'linear-gradient(135deg, var(--accent), var(--purple))',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    fontWeight: 700, fontSize: '0.8rem', color: 'white'
                                                                }}>
                                                                    {member.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                                                            {member.username}
                                                                        </p>
                                                                        {member.is_captain && (
                                                                            <span style={{
                                                                                fontSize: '0.68rem', fontWeight: 700,
                                                                                padding: '1px 6px',
                                                                                borderRadius: 'var(--radius-full)',
                                                                                background: 'rgba(245,158,11,0.15)',
                                                                                color: '#d97706',
                                                                                border: '1px solid rgba(245,158,11,0.3)'
                                                                            }}>
                                                                                Kapetan
                                                                            </span>
                                                                        )}
                                                                        {member.is_banned && (
                                                                            <span style={{
                                                                                fontSize: '0.68rem', fontWeight: 700,
                                                                                padding: '1px 6px',
                                                                                borderRadius: 'var(--radius-full)',
                                                                                background: 'rgba(239,68,68,0.1)',
                                                                                color: 'var(--error)',
                                                                                border: '1px solid rgba(239,68,68,0.3)'
                                                                            }}>
                                                                                Baniran
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                                        {member.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleBanPlayer(member.id, member.username, member.is_banned)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: 5,
                                                                    padding: '6px 12px',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    background: member.is_banned
                                                                        ? 'rgba(34,197,94,0.1)'
                                                                        : 'rgba(234,179,8,0.1)',
                                                                    border: member.is_banned
                                                                        ? '1px solid rgba(34,197,94,0.3)'
                                                                        : '1px solid rgba(234,179,8,0.3)',
                                                                    color: member.is_banned ? 'var(--success)' : '#ca8a04',
                                                                    fontSize: '0.78rem', fontWeight: 600,
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {member.is_banned
                                                                    ? <><ShieldOff size={13} /> Odblokir</>
                                                                    : <><Shield size={13} /> Blokiraj</>
                                                                }
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
        </div>
    );
};

export default AdminPanel;
