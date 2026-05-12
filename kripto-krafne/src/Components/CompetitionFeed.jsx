import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const FEED_URL = 'http://localhost/kripto-krafne/kripto-krafne/src/backend/competition_feed.php';
const POLL_MS  = 30000;
const AUTO_DISMISS_MS = 6000;

function eventKey(e) {
    return `${e.team_id}-${e.task_number}-${e.solved_at}`;
}

function FeedNotification({ event, onDismiss }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const t = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 350);
        }, AUTO_DISMISS_MS);
        return () => clearTimeout(t);
    }, [onDismiss]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--accent)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 12px var(--accent-soft)',
            minWidth: 280,
            maxWidth: 360,
            transform: visible ? 'translateX(0)' : 'translateX(120%)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.35s ease',
        }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🏴</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                    Zadatak #{event.task_number} riješen!
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Tim{' '}
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{event.team_name}</span>
                    {event.solver_name && (
                        <>
                            {' · '}
                            <Link
                                to={`/profile/${event.solver_id}`}
                                style={{ color: 'var(--yellow)', fontWeight: 600, textDecoration: 'none' }}
                            >
                                {event.solver_name}
                            </Link>
                        </>
                    )}
                </p>
            </div>
            <button
                onClick={() => { setVisible(false); setTimeout(onDismiss, 350); }}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 2, flexShrink: 0,
                    lineHeight: 1, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="Zatvori"
            >
                <FaTimes size={12} />
            </button>
        </div>
    );
}

export default function CompetitionFeed() {
    const [notifications, setNotifications] = useState([]);
    const seenRef = useRef(new Set());
    const seededRef = useRef(false);

    const dismiss = useCallback((key) => {
        setNotifications(prev => prev.filter(n => n._key !== key));
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchFeed = async (isInitialSeed = false) => {
            try {
                const res = await fetch(FEED_URL, { credentials: 'include' });
                const data = await res.json();
                if (cancelled || !data.success || !data.is_active) return;

                const events = data.events || [];

                if (isInitialSeed) {
                    events.forEach(e => seenRef.current.add(eventKey(e)));
                    seededRef.current = true;
                    return;
                }

                if (!seededRef.current) return;

                const fresh = events.filter(e => !seenRef.current.has(eventKey(e)));
                if (fresh.length === 0) return;

                fresh.forEach(e => seenRef.current.add(eventKey(e)));
                setNotifications(prev =>
                    [...fresh.map(e => ({ ...e, _key: eventKey(e) })), ...prev].slice(0, 4)
                );
            } catch {
                // ignore network errors silently
            }
        };

        fetchFeed(true);
        const interval = setInterval(() => fetchFeed(false), POLL_MS);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 900,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'flex-end',
            pointerEvents: 'none',
        }}>
            {notifications.map(n => (
                <div key={n._key} style={{ pointerEvents: 'all' }}>
                    <FeedNotification event={n} onDismiss={() => dismiss(n._key)} />
                </div>
            ))}
        </div>
    );
}
