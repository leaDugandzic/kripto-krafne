import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import AvatarImage from './AvatarImage';

const P = {
    1: { border: '#f59e0b', glow: 'rgba(245,158,11,0.25)', icon: <FaTrophy size={22} color="#f59e0b" /> },
    2: { border: '#94a3b8', glow: 'rgba(148,163,184,0.2)',  icon: <FaMedal  size={20} color="#94a3b8" /> },
    3: { border: '#cd7c3a', glow: 'rgba(205,124,58,0.2)',   icon: <FaMedal  size={20} color="#cd7c3a" /> },
};

function TeamCard({ team, pos, style = {} }) {
    const p = P[pos] || P[3];
    return (
        <div style={{
            border: `2px solid ${p.border}`,
            borderRadius: 18,
            padding: '22px 18px',
            textAlign: 'center',
            background: 'transparent',
            boxShadow: `0 0 24px ${p.glow}`,
            minWidth: 190,
            ...style,
        }}>
            <div style={{ marginBottom: 8 }}>{p.icon}</div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8, wordBreak: 'break-word' }}>
                {team.name}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                {team.members.map(m => (
                    <AvatarImage key={m.id} avatarKey={m.avatar} size={28} style={{ border: `1.5px solid ${p.border}` }} />
                ))}
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 800, color: p.border }}>{team.comp_score} bod.</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{team.tasks_solved}/6 zadataka</p>
        </div>
    );
}

function Podium({ teams }) {
    const t1 = teams.find(t => t.rank === 1);
    const t2 = teams.find(t => t.rank === 2);
    const t3 = teams.find(t => t.rank === 3);

    // Only 1st place — center it
    if (!t2 && !t3) {
        return t1 ? <TeamCard team={t1} pos={1} style={{ width: 240 }} /> : null;
    }

    return (
        /* 2nd | 1st (raised) | 3rd, overlapping left+right behind centre */
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {/* 2nd — left, sits lower, overlaps behind 1st */}
            {t2 && (
                <div style={{ position: 'relative', zIndex: 1, marginRight: -28, marginBottom: 0 }}>
                    <TeamCard team={t2} pos={2} style={{ width: 210 }} />
                </div>
            )}
            {/* 1st — center, raised above the two side cards */}
            {t1 && (
                <div style={{ position: 'relative', zIndex: 3, marginBottom: 36 }}>
                    <TeamCard team={t1} pos={1} style={{ width: 230 }} />
                </div>
            )}
            {/* 3rd — right, sits lower, overlaps behind 1st */}
            {t3 && (
                <div style={{ position: 'relative', zIndex: 1, marginLeft: -28, marginBottom: 0 }}>
                    <TeamCard team={t3} pos={3} style={{ width: 210 }} />
                </div>
            )}
        </div>
    );
}

function TaskTable({ stats }) {
    if (!stats.length) return <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nema podataka.</p>;
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    {['Zadatak', 'Bodovi', 'Riješenost', 'Prosjek (min)'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {stats.map(s => (
                    <tr key={s.task_number} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--yellow)', fontWeight: 700 }}>{s.points}</td>
                        <td style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: 'var(--glass-border)', borderRadius: 99, overflow: 'hidden', minWidth: 60 }}>
                                    <div style={{ height: '100%', width: `${s.completion_pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--purple))', borderRadius: 99 }} />
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', minWidth: 36 }}>{s.completion_pct}%</span>
                            </div>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {s.avg_minutes !== null ? `${s.avg_minutes} min` : '—'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default function HallOfFame() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/hall_of_fame.php', { credentials: 'include' })
            .then(r => r.json())
            .then(d => { if (d.success) setData(d); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent)', animation: 'rotateDonut 0.8s linear infinite' }} />
        </div>
    );

    const competitions = data?.competitions ?? [];

    const fmtDate = (s) => s ? new Date(s).toLocaleDateString('hr-HR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 68, height: 68, borderRadius: '50%', marginBottom: 18, background: 'linear-gradient(135deg, var(--yellow), var(--orange))', boxShadow: '0 0 28px rgba(255,180,50,0.35)' }}>
                        <FaTrophy size={30} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
                        Hall of Fame
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Rezultati svih dosadašnjih natjecanja
                    </p>
                </div>

                {competitions.length === 0 && (
                    <div className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏆</p>
                        <p style={{ color: 'var(--text-muted)' }}>Još nema završenih natjecanja.</p>
                    </div>
                )}

                {competitions.map((comp, idx) => (
                    <div key={comp.id} style={{ marginBottom: idx < competitions.length - 1 ? 64 : 0 }}>
                        {/* Competition label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                Natjecanje #{comp.id} · {fmtDate(comp.end_time)}
                                {comp.is_active && <span style={{ marginLeft: 8, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '1px 8px', borderRadius: 99, fontSize: '0.68rem' }}>U tijeku</span>}
                            </span>
                            <div style={{ flex: 1, height: 1, background: 'var(--glass-border)' }} />
                        </div>

                        {/* Two-column layout */}
                        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {/* Left: task stats */}
                            <div className="glass-card" style={{ flex: '1 1 340px', padding: '24px 28px', minWidth: 300 }}>
                                <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                                    Statistika zadataka
                                </h3>
                                <TaskTable stats={comp.task_stats} />
                            </div>

                            {/* Right: podium */}
                            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                                <Podium teams={comp.teams} />
                                {/* Remaining teams */}
                                {comp.teams.filter(t => t.rank > 3).length > 0 && (
                                    <div style={{ width: '100%', maxWidth: 520 }}>
                                        <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
                                            Ostali timovi
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {comp.teams.filter(t => t.rank > 3).map(t => (
                                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
                                                    <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.825rem', minWidth: 24 }}>{t.rank}.</span>
                                                    <div style={{ display: 'flex', gap: 3 }}>
                                                        {t.members.map(m => <AvatarImage key={m.id} avatarKey={m.avatar} size={22} style={{ border: '1px solid var(--glass-border)' }} />)}
                                                    </div>
                                                    <span style={{ flex: 1, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{t.name}</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.875rem' }}>{t.comp_score} bod.</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
