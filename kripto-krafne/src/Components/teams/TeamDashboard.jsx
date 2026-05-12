import { useState, useEffect } from 'react';
import { Crown, Users, CheckCircle, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import AvatarImage from '../AvatarImage';

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

    if (!teamData) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className="glass-card" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 400 }}>
                    <Users size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Nisi u timu</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Pridruži se timu ili stvori novi da vidiš dashboard.
                    </p>
                </div>
            </div>
        );
    }

    const completedTasks = teamData.progress.length;
    const totalTasks = 6;
    const progressPct = (completedTasks / totalTasks) * 100;

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: 8
                    }}>
                        Team Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Pratite napredak vašeg tima
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Team info + progress */}
                        <div className="glass-card" style={{ padding: '28px 32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                                <div>
                                    <h2 style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.6rem', fontWeight: 800,
                                        color: 'var(--text-primary)', marginBottom: 4
                                    }}>
                                        {teamData.team.name}
                                    </h2>
                                    <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {teamData.team.score} bodova
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                                        Stvoreno
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {new Date(teamData.team.created_at).toLocaleDateString('hr-HR')}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        Napredak
                                    </span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {completedTasks}/{totalTasks} zadataka
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%', height: 8,
                                    background: 'var(--glass-border)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${progressPct}%`,
                                        background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.6s ease'
                                    }} />
                                </div>
                            </div>
                        </div>

                        {/* Tasks grid */}
                        <div className="glass-card" style={{ padding: '28px 32px' }}>
                            <h3 style={{
                                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20
                            }}>
                                Zadaci
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                {[1, 2, 3, 4, 5, 6].map(taskNum => {
                                    const task = teamData.progress.find(p => p.task_number === taskNum);
                                    return (
                                        <div key={taskNum} style={{
                                            padding: '18px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1.5px solid ${task ? 'var(--success)' : 'var(--glass-border)'}`,
                                            background: task ? 'rgba(34, 197, 94, 0.07)' : 'var(--glass-bg)',
                                            transition: 'all 0.2s'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                                    Zadatak {taskNum}
                                                </p>
                                                {task
                                                    ? <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                                    : <Clock size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                                }
                                            </div>
                                            <p style={{ fontSize: '0.78rem', color: task ? 'var(--success)' : 'var(--text-muted)' }}>
                                                {task ? (
                                                    <>Riješio:{' '}
                                                        <Link
                                                            to={`/profile/${task.solved_by_user_id}`}
                                                            style={{ color: 'var(--success)', fontWeight: 600, textDecoration: 'none' }}
                                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                                        >
                                                            {task.solved_by_username || `#${task.solved_by_user_id}`}
                                                        </Link>
                                                    </>
                                                ) : 'Na čekanju'}
                                            </p>
                                            {task && (
                                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                    {new Date(task.solved_at).toLocaleDateString('hr-HR')}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar: members */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="glass-card" style={{ padding: '24px 20px' }}>
                            <h3 style={{
                                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16
                            }}>
                                Članovi tima
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {teamData.members.map(member => (
                                    <div key={member.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '12px 14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--glass-border)',
                                        background: 'var(--glass-bg)'
                                    }}>
                                        <AvatarImage
                                            avatarKey={member.avatar}
                                            size={36}
                                            style={{ border: `2px solid ${member.is_captain ? '#f59e0b' : 'var(--accent)'}` }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <Link
                                                    to={`/profile/${member.id}`}
                                                    style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', transition: 'color 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                                >
                                                    {member.username}
                                                </Link>
                                                {member.is_captain && <Crown size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                                            </div>
                                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                {member.is_captain ? 'Kapetan' : 'Član'} · {new Date(member.joined_at).toLocaleDateString('hr-HR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{
                                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14
                            }}>
                                Statistike
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <div style={{
                                    textAlign: 'center', padding: '14px 8px',
                                    background: 'var(--accent-soft)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--accent)'
                                }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                                        {completedTasks}
                                    </p>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Riješeno</p>
                                </div>
                                <div style={{
                                    textAlign: 'center', padding: '14px 8px',
                                    background: 'rgba(139,92,246,0.08)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(139,92,246,0.25)'
                                }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple)' }}>
                                        {teamData.members.length}
                                    </p>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Članova</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate + Hall of Fame links */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
                    <Link to="/certificate">
                        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Award size={16} /> Preuzmi certifikat
                        </button>
                    </Link>
                    <Link to="/hall-of-fame">
                        <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            🏆 Hall of Fame
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;
