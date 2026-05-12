import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { FaFire, FaTrophy, FaBook, FaUsers } from 'react-icons/fa';
import { Pencil, X } from 'lucide-react';
import AchievementBadge, { ACHIEVEMENTS } from './AchievementBadge';
import AvatarImage from './AvatarImage';
import { AVATARS, getAvatar } from '../assets/avatars';

const ALL_ACHIEVEMENT_KEYS = Object.keys(ACHIEVEMENTS);

function XpBar({ xp }) {
    const level = Math.floor(xp / 200) + 1;
    const xpInLevel = xp % 200;
    const pct = (xpInLevel / 200) * 100;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Razina {level}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {xp} XP
                </span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--glass-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--yellow))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.6s ease',
                }} />
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                {xpInLevel}/200 XP do razine {level + 1}
            </p>
        </div>
    );
}

const AVATAR_KEYS = Object.keys(AVATARS);

export default function Profile() {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarKey, setAvatarKey] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        fetch(`http://localhost/kripto-krafne/kripto-krafne/src/backend/profile.php?id=${userId}`, {
            credentials: 'include',
        })
            .then(r => r.json())
            .then(d => {
                if (d.success) { setData(d); setAvatarKey(d.user.avatar ?? null); }
                else setError(d.message || 'Profil nije pronađen');
            })
            .catch(() => setError('Greška pri učitavanju profila'))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent)', animation: 'rotateDonut 0.8s linear infinite' }} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: 400 }}>
                    <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍩</p>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{error || 'Korisnik nije pronađen'}</h3>
                    <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>Početna</Link>
                </div>
            </div>
        );
    }

    const { user, streak, achievements, level_progress, levels_done, ctf_solves, team, is_own_profile } = data;
    const earnedKeys = new Set(achievements.map(a => a.achievement_key));

    const handleAvatarSelect = async (key) => {
        setSavingAvatar(true);
        try {
            const res = await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/update_avatar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ avatar: key }),
            });
            const d = await res.json();
            if (d.success) {
                setAvatarKey(d.avatar);
                setShowPicker(false);
                window.dispatchEvent(new CustomEvent('kk-avatar-updated', { detail: { avatar: d.avatar } }));
            }
        } catch (err) { console.error(err); }
        finally { setSavingAvatar(false); }
    };

    return (
        <>
        <div className="page-wrapper">
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
                {/* Header card */}
                <div className="glass-card" style={{ padding: '36px 40px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
                    {/* Decorative gradient blob */}
                    <div aria-hidden="true" style={{
                        position: 'absolute', top: -60, right: -60, width: 200, height: 200,
                        borderRadius: '50%', background: 'var(--accent-soft)', filter: 'blur(60px)', pointerEvents: 'none',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, flexWrap: 'wrap', position: 'relative' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <AvatarImage
                                avatarKey={avatarKey}
                                size={80}
                                style={{ border: '3px solid var(--accent)', boxShadow: '0 0 20px var(--accent-soft)' }}
                            />
                            {is_own_profile && (
                                <button
                                    onClick={() => setShowPicker(true)}
                                    title="Promijeni avatar"
                                    style={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        width: 26, height: 26, borderRadius: '50%',
                                        background: 'var(--accent)', border: '2px solid var(--bg-elevated)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#fff',
                                    }}
                                >
                                    <Pencil size={12} />
                                </button>
                            )}
                        </div>


                        {/* Name + badges */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    {user.name}
                                </h1>
                                {user.is_admin && (
                                    <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))', color: '#fff', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                                        Admin
                                    </span>
                                )}
                                {is_own_profile && (
                                    <span style={{ background: 'var(--yellow-soft)', color: 'var(--yellow)', border: '1px solid var(--yellow)', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700 }}>
                                        Moj profil
                                    </span>
                                )}
                            </div>

                            {is_own_profile && user.email && (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 10 }}>{user.email}</p>
                            )}

                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Član od {new Date(user.created_at).toLocaleDateString('hr-HR', { year: 'numeric', month: 'long' })}
                            </p>
                        </div>

                        {/* XP bar */}
                        <div style={{ minWidth: 220, flex: 1 }}>
                            <XpBar xp={user.xp} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Achievements */}
                        <div className="glass-card" style={{ padding: '28px 32px' }}>
                            <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 24 }}>
                                Dostignuća ({achievements.length}/{ALL_ACHIEVEMENT_KEYS.length})
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'flex-start' }}>
                                {ALL_ACHIEVEMENT_KEYS.map(key => (
                                    <AchievementBadge
                                        key={key}
                                        achievementKey={key}
                                        earned={earnedKeys.has(key)}
                                        size="md"
                                        showLabel
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Level progress */}
                        <div className="glass-card" style={{ padding: '28px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                    Završene lekcije
                                </h2>
                                <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                                    {levels_done} lekcija
                                </span>
                            </div>

                            {level_progress.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '16px 0' }}>
                                    Još nema završenih lekcija.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {level_progress.map(lp => (
                                        <div key={lp.level_id} style={{
                                            padding: '8px 16px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--accent-soft)',
                                            border: '1px solid var(--accent)',
                                            fontSize: '0.825rem',
                                            fontWeight: 600,
                                            color: 'var(--accent)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                        }}>
                                            <FaBook size={11} />
                                            Lekcija {lp.level_id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Streak */}
                        <div className="glass-card" style={{ padding: '24px 20px' }}>
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                                Aktivnost
                            </h3>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ flex: 1, textAlign: 'center', padding: '16px 12px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                    <FaFire size={22} color="#ff7b35" style={{ marginBottom: 6 }} />
                                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{streak.current}</p>
                                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>Trenutni streak</p>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', padding: '16px 12px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                    <FaTrophy size={20} color="var(--yellow)" style={{ marginBottom: 6 }} />
                                    <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{streak.longest}</p>
                                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>Najduži streak</p>
                                </div>
                            </div>
                        </div>

                        {/* CTF stats */}
                        <div className="glass-card" style={{ padding: '24px 20px' }}>
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                                CTF Statistika
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                <FaTrophy size={24} color="var(--yellow)" style={{ flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{ctf_solves}</p>
                                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>CTF zadataka riješeno</p>
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="glass-card" style={{ padding: '24px 20px' }}>
                            <h3 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>
                                Tim
                            </h3>
                            {team ? (
                                <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <FaUsers size={16} color="var(--accent)" />
                                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{team.name}</p>
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>{team.score} bodova</p>
                                    {team.is_captain && (
                                        <p style={{ fontSize: '0.68rem', color: 'var(--yellow)', fontWeight: 600, marginTop: 4 }}>⭐ Kapetan</p>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Nije u timu</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .profile-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>

        {/* Avatar picker — rendered in document.body so it escapes all parent containers */}
        {showPicker && createPortal(
            <div
                onClick={() => setShowPicker(false)}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 24,
                }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--glass-border-strong)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                        padding: '36px 40px',
                        width: '100%',
                        maxWidth: 700,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                                Odaberi avatar
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                                Klikni na donut koji ti se sviđa
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPicker(false)}
                            style={{
                                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-full)', width: 36, height: 36,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ height: 1, background: 'var(--glass-border)', margin: '20px 0 28px' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
                        {AVATAR_KEYS.map(key => {
                            const selected = avatarKey === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => !savingAvatar && handleAvatarSelect(key)}
                                    disabled={savingAvatar}
                                    style={{
                                        background: selected ? 'var(--accent-soft)' : 'var(--glass-bg)',
                                        border: `2px solid ${selected ? 'var(--accent)' : 'var(--glass-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        padding: '14px 10px 10px',
                                        cursor: savingAvatar ? 'wait' : 'pointer',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: 10,
                                        transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
                                        transform: selected ? 'translateY(-3px)' : 'none',
                                        boxShadow: selected ? '0 4px 20px var(--accent-soft)' : 'none',
                                        fontFamily: 'var(--font-body)',
                                    }}
                                    onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                                    onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = selected ? 'translateY(-3px)' : 'none'; } }}
                                >
                                    <img
                                        src={getAvatar(key)}
                                        alt={key}
                                        style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                                    />
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 600,
                                        color: selected ? 'var(--accent)' : 'var(--text-muted)',
                                        textTransform: 'capitalize', letterSpacing: '0.04em',
                                    }}>
                                        {key}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {savingAvatar && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--glass-border)', borderTopColor: 'var(--accent)', animation: 'rotateDonut 0.7s linear infinite' }} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Spremam avatar…</span>
                        </div>
                    )}
                </div>
            </div>,
            document.body
        )}
        </>
    );
}
