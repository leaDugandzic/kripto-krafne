import { useState, useEffect } from 'react';
import { Trophy, Timer, RefreshCw } from 'lucide-react';

const medalColors = ['#f59e0b', '#9ca3af', '#cd7c2f'];
const medalLabels = ['1.', '2.', '3.'];

const Leaderboard = () => {
    const [teams, setTeams] = useState([]);
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [endTime, setEndTime] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    // Live countdown — runs every second off the absolute endTime timestamp
    useEffect(() => {
        if (!endTime || !competition?.is_active) {
            setTimeRemaining(0);
            return;
        }
        const tick = () => setTimeRemaining(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endTime, competition?.is_active]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/leaderboard.php?limit=20', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setTeams(data.teams);
                setCompetition(data.competition);
                if (data.competition?.is_active && data.competition.end_time) {
                    setEndTime(new Date(data.competition.end_time).getTime());
                } else {
                    setEndTime(null);
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
                        CTF Ljestvica
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Rang lista timova prema bodovima
                    </p>
                </div>

                {/* Competition status banner */}
                <div style={{ marginBottom: 28 }}>
                    {competition?.is_active ? (
                        <div style={{
                            padding: '20px 28px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))',
                            border: '1.5px solid rgba(34,197,94,0.4)',
                            display: 'flex', flexWrap: 'wrap',
                            alignItems: 'center', justifyContent: 'space-between', gap: 16
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: 'var(--success)',
                                    boxShadow: '0 0 8px var(--success)',
                                    animation: 'pulse 2s ease-in-out infinite'
                                }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1rem' }}>
                                        Natjecanje aktivno
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: 2 }}>
                                        Rješavajte zadatke da osvajate bodove za tim
                                    </p>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 18px',
                                background: 'rgba(34,197,94,0.12)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(34,197,94,0.3)'
                            }}>
                                <Timer size={18} style={{ color: 'var(--success)' }} />
                                <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.05em' }}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '20px 28px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(234,179,8,0.1)',
                            border: '1.5px solid rgba(234,179,8,0.35)',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontWeight: 700, color: '#ca8a04', fontSize: '1rem' }}>
                                Natjecanje na pauzi
                            </p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: 4 }}>
                                Čeka se administrator da pokrene natjecanje
                            </p>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                    {/* Table header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr 100px 160px 120px 140px',
                        padding: '12px 24px',
                        borderBottom: '1px solid var(--glass-border)',
                        background: 'var(--bg-elevated)'
                    }}>
                        {['#', 'Tim', 'Bodovi', 'Zadaci', 'Članovi', 'Zadnje rješenje'].map((h, i) => (
                            <span key={i} style={{
                                fontSize: '0.72rem', fontWeight: 700,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                color: 'var(--text-muted)'
                            }}>
                                {h}
                            </span>
                        ))}
                    </div>

                    {teams.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                            <Trophy size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Još nema timova u natjecanju.
                            </p>
                        </div>
                    ) : (
                        teams.map((team, index) => {
                            const isTop3 = index < 3;
                            return (
                                <div key={team.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '56px 1fr 100px 160px 120px 140px',
                                    padding: '16px 24px',
                                    borderBottom: '1px solid var(--glass-border)',
                                    background: isTop3
                                        ? `linear-gradient(90deg, ${index === 0 ? 'rgba(245,158,11,0.06)' : index === 1 ? 'rgba(156,163,175,0.06)' : 'rgba(205,124,47,0.06)'}, transparent)`
                                        : 'transparent',
                                    transition: 'background 0.15s',
                                    alignItems: 'center'
                                }}
                                    onMouseEnter={e => !isTop3 && (e.currentTarget.style.background = 'var(--glass-bg)')}
                                    onMouseLeave={e => !isTop3 && (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Rank */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {isTop3 ? (
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: `${medalColors[index]}22`,
                                                border: `2px solid ${medalColors[index]}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.8rem',
                                                color: medalColors[index]
                                            }}>
                                                {medalLabels[index]}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                #{index + 1}
                                            </span>
                                        )}
                                    </div>

                                    {/* Team name */}
                                    <div>
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                            {team.team_name}
                                        </p>
                                    </div>

                                    {/* Score */}
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent)' }}>
                                            {team.score}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 3 }}>pts</span>
                                    </div>

                                    {/* Tasks progress */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            flex: 1, height: 6,
                                            background: 'var(--glass-border)',
                                            borderRadius: 'var(--radius-full)',
                                            overflow: 'hidden',
                                            maxWidth: 80
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${(team.tasks_solved / 6) * 100}%`,
                                                background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                                                borderRadius: 'var(--radius-full)'
                                            }} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                            {team.tasks_solved}/6
                                        </span>
                                    </div>

                                    {/* Members avatars */}
                                    <div style={{ display: 'flex' }}>
                                        {team.members.split(', ').slice(0, 3).map((member, i) => (
                                            <div key={i} style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                                                border: '2px solid var(--bg-base)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                marginLeft: i > 0 ? -8 : 0,
                                                fontSize: '0.72rem', fontWeight: 700, color: 'white'
                                            }} title={member}>
                                                {member.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {team.member_count > 3 && (
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%',
                                                background: 'var(--glass-bg)',
                                                border: '2px solid var(--bg-base)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                marginLeft: -8,
                                                fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)'
                                            }}>
                                                +{team.member_count - 3}
                                            </div>
                                        )}
                                    </div>

                                    {/* Last solve */}
                                    <div>
                                        {team.last_solved ? (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {new Date(team.last_solved).toLocaleDateString('hr-HR')}
                                                {' '}
                                                <span style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(team.last_solved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Footer */}
                    <div style={{
                        padding: '12px 24px',
                        borderTop: '1px solid var(--glass-border)',
                        background: 'var(--bg-elevated)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Prikazano {teams.length} timova
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <RefreshCw size={12} />
                            Ažurirano: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
