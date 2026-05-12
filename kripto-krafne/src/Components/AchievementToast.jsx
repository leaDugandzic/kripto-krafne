import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import AchievementBadge, { ACHIEVEMENTS } from './AchievementBadge';

// Call from anywhere to trigger a toast
export function showAchievementToast(achievementKey) {
    if (!ACHIEVEMENTS[achievementKey]) return;
    window.dispatchEvent(new CustomEvent('kk-achievement', { detail: { key: achievementKey } }));
}

// Queue from sessionStorage (used after login page redirect)
export function flushPendingAchievements() {
    try {
        const raw = sessionStorage.getItem('kk-pending-achievements');
        if (!raw) return;
        sessionStorage.removeItem('kk-pending-achievements');
        const keys = JSON.parse(raw);
        if (Array.isArray(keys)) {
            // Stagger so they don't all appear at once
            keys.forEach((key, i) => {
                setTimeout(() => showAchievementToast(key), i * 800);
            });
        }
    } catch {}
}

function Toast({ achievementKey, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const ach = ACHIEVEMENTS[achievementKey];

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const t = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 400);
        }, 5000);
        return () => clearTimeout(t);
    }, [onDismiss]);

    if (!ach) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px 14px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--accent)',
            boxShadow: '0 6px 32px rgba(0,0,0,0.4), 0 0 16px var(--accent-soft)',
            minWidth: 260,
            maxWidth: 340,
            transform: visible ? 'translateX(0)' : 'translateX(120%)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s ease',
        }}>
            <AchievementBadge achievementKey={achievementKey} earned size="sm" showLabel={false} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                    Dostignuće otključano!
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {ach.name}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                    {ach.desc}
                </p>
            </div>
            <button
                onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0, transition: 'color 0.15s', lineHeight: 1 }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="Zatvori"
            >
                <FaTimes size={12} />
            </button>
        </div>
    );
}

export default function AchievementToast() {
    const [toasts, setToasts] = useState([]);
    const flushedRef = useRef(false);

    useEffect(() => {
        // Show any achievements queued from a login redirect (fires once on mount)
        if (!flushedRef.current) {
            flushedRef.current = true;
            flushPendingAchievements();
        }

        const handler = (e) => {
            const key = e.detail?.key;
            if (!key || !ACHIEVEMENTS[key]) return;
            const id = `${key}-${Date.now()}`;
            setToasts(prev => [...prev, { id, key }].slice(-4));
        };

        window.addEventListener('kk-achievement', handler);
        return () => window.removeEventListener('kk-achievement', handler);
    }, []);

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 80,
            right: 20,
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'flex-end',
            pointerEvents: 'none',
        }}>
            {toasts.map(t => (
                <div key={t.id} style={{ pointerEvents: 'all' }}>
                    <Toast achievementKey={t.key} onDismiss={() => dismiss(t.id)} />
                </div>
            ))}
        </div>
    );
}
