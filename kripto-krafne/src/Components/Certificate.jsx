import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import { Printer, ArrowLeft } from 'lucide-react';
import AvatarImage from './AvatarImage';
import Logo from '../assets/img/logo.png';

const ORDINAL_HR = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.'];

function ordinalLabel(n) {
    if (n === 1) return '1. mjesto';
    if (n === 2) return '2. mjesto';
    if (n === 3) return '3. mjesto';
    return `${n}. mjesto`;
}

function placementColor(n) {
    if (n === 1) return '#f59e0b';
    if (n === 2) return '#94a3b8';
    if (n === 3) return '#cd7c3a';
    return 'var(--accent)';
}

function PlacementIcon({ rank, size = 40 }) {
    const color = placementColor(rank);
    if (rank <= 3) {
        const Icon = rank === 1 ? FaTrophy : FaMedal;
        return <Icon size={size} color={color} />;
    }
    return <FaStar size={size} color={color} />;
}

export default function Certificate() {
    const [searchParams] = useSearchParams();
    const teamIdParam = searchParams.get('team_id');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const certRef = useRef(null);

    useEffect(() => {
        const url = teamIdParam
            ? `http://localhost/kripto-krafne/kripto-krafne/src/backend/certificate.php?team_id=${teamIdParam}`
            : 'http://localhost/kripto-krafne/kripto-krafne/src/backend/certificate.php';
        fetch(url, { credentials: 'include' })
            .then(r => r.json())
            .then(d => { if (d.success) setData(d); else setError(d.message); })
            .catch(() => setError('Greška pri učitavanju'))
            .finally(() => setLoading(false));
    }, [teamIdParam]);

    if (loading) return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent)', animation: 'rotateDonut 0.8s linear infinite' }} />
        </div>
    );

    if (error || !data) return (
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: 400 }}>
                <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍩</p>
                <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{error || 'Certifikat nedostupan'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
                    {error === 'You are not in a team' ? 'Morate biti u timu kako biste dobili certifikat.' : 'Molimo pokušajte ponovo.'}
                </p>
                <Link to="/teams" className="btn btn-primary" style={{ display: 'inline-flex' }}>Moj tim</Link>
            </div>
        </div>
    );

    const { team, members, tasks_solved, total_tasks, placement, total_teams, competition } = data;
    const pColor = placementColor(placement);

    const fmtDate = (s) => s ? new Date(s).toLocaleDateString('hr-HR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;
    const compDate = competition?.end_time ? fmtDate(competition.end_time) : fmtDate(new Date().toISOString());

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 860, margin: '0 auto' }}>

                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                    <Link to="/team-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <ArrowLeft size={16} /> Natrag
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <Printer size={16} /> Preuzmi / Ispiši
                    </button>
                </div>

                {/* ── Certificate card ── */}
                <div
                    id="certificate"
                    ref={certRef}
                    style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: 'var(--radius-lg)',
                        border: `3px solid ${pColor}`,
                        boxShadow: `0 0 60px ${pColor}33, 0 24px 60px rgba(0,0,0,0.4)`,
                        padding: '56px 64px',
                        position: 'relative',
                        overflow: 'hidden',
                        textAlign: 'center',
                    }}
                >
                    {/* Corner decorations */}
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(corner => (
                        <div key={corner} style={{
                            position: 'absolute',
                            top: corner.includes('top') ? 16 : 'auto',
                            bottom: corner.includes('bottom') ? 16 : 'auto',
                            left: corner.includes('left') ? 16 : 'auto',
                            right: corner.includes('right') ? 16 : 'auto',
                            width: 48, height: 48,
                            borderTop: corner.includes('top') ? `3px solid ${pColor}` : 'none',
                            borderBottom: corner.includes('bottom') ? `3px solid ${pColor}` : 'none',
                            borderLeft: corner.includes('left') ? `3px solid ${pColor}` : 'none',
                            borderRight: corner.includes('right') ? `3px solid ${pColor}` : 'none',
                            borderRadius: corner === 'top-left' ? '4px 0 0 0' : corner === 'top-right' ? '0 4px 0 0' : corner === 'bottom-left' ? '0 0 0 4px' : '0 0 4px 0',
                            opacity: 0.7,
                        }} />
                    ))}

                    {/* Ambient glow blob */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
                        width: 360, height: 200, borderRadius: '50%',
                        background: `radial-gradient(ellipse, ${pColor}22 0%, transparent 70%)`,
                        pointerEvents: 'none',
                    }} />

                    {/* Logo + platform name */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
                        <img src={Logo} alt="Kripto Krafne" style={{ width: 36, height: 36 }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                            KRIPTO KRAFNE
                        </span>
                    </div>

                    {/* "This certifies" */}
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
                        ovim se potvrđuje da je tim
                    </p>

                    {/* Team name */}
                    <h1 className="cert-title" style={{
                        fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900, marginBottom: 28,
                        background: `linear-gradient(135deg, ${pColor}, var(--accent))`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {team.name}
                    </h1>

                    {/* Divider */}
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${pColor}, transparent)`, margin: '0 auto 28px', maxWidth: 400 }} />

                    {/* Placement trophy */}
                    <div style={{ marginBottom: 12 }}>
                        <PlacementIcon rank={placement} size={52} />
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: pColor, marginBottom: 6 }}>
                        {ordinalLabel(placement)}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 32 }}>
                        od {total_teams} timova
                    </p>

                    {/* Stats row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 36 }}>
                        {[
                            { label: 'Riješeni zadaci', value: `${tasks_solved} / ${total_tasks}` },
                            { label: 'Ukupni bodovi', value: team.score },
                        ].map(s => (
                            <div key={s.label} style={{
                                padding: '16px 28px', borderRadius: 'var(--radius-md)',
                                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                                minWidth: 140,
                            }}>
                                <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{s.value}</p>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Members */}
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                        Članovi tima
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 36, flexWrap: 'wrap' }}>
                        {members.map(m => (
                            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <AvatarImage
                                    avatarKey={m.avatar}
                                    size={56}
                                    style={{ border: `2px solid ${m.is_captain ? pColor : 'var(--glass-border)'}`, boxShadow: m.is_captain ? `0 0 12px ${pColor}55` : 'none' }}
                                />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.username}</span>
                                {m.is_captain && (
                                    <span style={{ fontSize: '0.65rem', color: pColor, fontWeight: 700, letterSpacing: '0.06em' }}>KAPETAN</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${pColor}, transparent)`, margin: '0 auto 20px', maxWidth: 400 }} />

                    {/* Date */}
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{compDate}</p>
                </div>
            </div>

            {/* Print styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #certificate, #certificate * { visibility: visible !important; color-adjust: exact; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    #certificate {
                        position: fixed !important; inset: 30px !important;
                        margin: 0 !important; box-shadow: none !important;
                        background: #fff !important;
                    }
                    .cert-title {
                        color: #c9a227 !important;
                        -webkit-text-fill-color: #c9a227 !important;
                        background: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
