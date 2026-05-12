import Logo from '../assets/img/logo.png';
import { getAvatar } from '../assets/avatars';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Trophy, Settings, LogOut, ChevronDown, User } from 'lucide-react';

function Navbar({ theme, onToggleTheme }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [competitionActive, setCompetitionActive] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => { checkSession(); }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location]);

    useEffect(() => {
        const onAvatarUpdated = (e) => setUser(prev => prev ? { ...prev, avatar: e.detail.avatar } : prev);
        window.addEventListener('kk-avatar-updated', onAvatarUpdated);
        return () => window.removeEventListener('kk-avatar-updated', onAvatarUpdated);
    }, []);

    const checkSession = () => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/session.php", {
            method: "GET", credentials: "include",
        })
            .then(r => r.json())
            .then(data => {
                if (data.authenticated) {
                    setUser({ id: data.user_id, username: data.username, isAdmin: Boolean(data.is_admin), avatar: data.avatar ?? null });
                    checkCompetition();
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    };

    const checkCompetition = () => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/competition_status.php", {
            credentials: "include"
        })
            .then(r => r.json())
            .then(data => setCompetitionActive(!!(data.success && data.is_active)))
            .catch(() => {});
    };

    const handleLogout = () => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/logout.php", {
            method: "POST", credentials: "include",
        })
            .then(r => r.json())
            .then(() => {
                sessionStorage.clear();
                setUser(null);
                setDropdownOpen(false);
                window.location.href = '/';
            })
            .catch(console.error);
    };

    // ── Nav links visible to everyone
    const publicLinks = [
        { to: '/', label: 'Početna' },
        { to: '/forums', label: 'Forum' },
    ];

    // ── Nav links visible only when logged in
    const authLinks = [
        { to: '/teams', label: 'Moj Tim' },
        ...(competitionActive ? [
            { to: '/ctf-game', label: '🏴 Natjecanje', highlight: true },
            { to: '/leaderboard', label: 'Ljestvica' },
        ] : []),
        { to: '/hall-of-fame', label: '🏆 Hall of Fame' },
    ];

    const allLinks = user ? [...publicLinks, ...authLinks] : publicLinks;

    return (
        <>
            <nav className={`kk-navbar${scrolled ? ' kk-navbar--scrolled' : ''}`}>
                <div className="kk-navbar__inner">
                    {/* Brand */}
                    <Link to="/" className="kk-navbar__brand">
                        <img src={Logo} alt="Kripto Krafne" className="kk-navbar__logo" />
                        <span className="kk-navbar__name title-font">Kripto Krafne</span>
                    </Link>

                    {/* Desktop links */}
                    <ul className="kk-navbar__links">
                        {allLinks.map(({ to, label, highlight }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`kk-navbar__link${location.pathname === to ? ' kk-navbar__link--active' : ''}${highlight ? ' kk-navbar__link--highlight' : ''}`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Right */}
                    <div className="kk-navbar__right">
                        {/* Theme toggle */}
                        <button
                            className="theme-toggle"
                            onClick={onToggleTheme}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        >
                            <span className="theme-toggle-knob" />
                            <span className="theme-toggle-icon theme-toggle-icon--dark">🌙</span>
                            <span className="theme-toggle-icon theme-toggle-icon--light">☀️</span>
                        </button>

                        {loading ? (
                            <div className="kk-navbar__loading" />
                        ) : user ? (
                            <div className="kk-navbar__profile" ref={dropdownRef}>
                                <button
                                    className="kk-navbar__avatar-btn"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    aria-expanded={dropdownOpen}
                                >
                                    <img src={getAvatar(user.avatar)} alt="Profile" className="kk-navbar__avatar" />
                                    <span className="kk-navbar__username">{user.username}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`kk-navbar__chevron-icon${dropdownOpen ? ' kk-navbar__chevron-icon--open' : ''}`}
                                        strokeWidth={2.5}
                                    />
                                </button>

                                {dropdownOpen && (
                                    <div className="kk-dropdown animate-scale-in">
                                        <div className="kk-dropdown__header">
                                            <span className="kk-dropdown__greeting">{user.username}</span>
                                        </div>
                                        <ul className="kk-dropdown__list">
                                            <li>
                                                <Link to={`/profile/${user.id}`} className="kk-dropdown__item" onClick={() => setDropdownOpen(false)}>
                                                    <User size={15} strokeWidth={2} /> Moj Profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/teams" className="kk-dropdown__item" onClick={() => setDropdownOpen(false)}>
                                                    <Users size={15} strokeWidth={2} /> Moj Tim
                                                </Link>
                                            </li>
                                            {competitionActive && (
                                                <li>
                                                    <Link to="/leaderboard" className="kk-dropdown__item" onClick={() => setDropdownOpen(false)}>
                                                        <Trophy size={15} strokeWidth={2} /> Ljestvica
                                                    </Link>
                                                </li>
                                            )}
                                            {user.isAdmin && (
                                                <li>
                                                    <Link to="/admin" className="kk-dropdown__item" onClick={() => setDropdownOpen(false)}>
                                                        <Settings size={15} strokeWidth={2} /> Admin Panel
                                                    </Link>
                                                </li>
                                            )}
                                            <li className="kk-dropdown__divider" />
                                            <li>
                                                <button onClick={handleLogout} className="kk-dropdown__item kk-dropdown__item--danger">
                                                    <LogOut size={15} strokeWidth={2} /> Odjava
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="kk-navbar__auth">
                                <Link to="/login" className="btn btn-ghost kk-navbar__auth-btn">Prijava</Link>
                                <Link to="/signup" className="btn btn-primary kk-navbar__auth-btn">Registracija</Link>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`kk-hamburger${menuOpen ? ' kk-hamburger--open' : ''}`}
                            onClick={() => setMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                            aria-expanded={menuOpen}
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            <div className={`kk-mobile-menu${menuOpen ? ' kk-mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
                <div className="kk-mobile-menu__inner">
                    <ul className="kk-mobile-menu__links">
                        {allLinks.map(({ to, label, highlight }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`kk-mobile-menu__link${location.pathname === to ? ' kk-mobile-menu__link--active' : ''}${highlight ? ' kk-mobile-menu__link--highlight' : ''}`}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!user && !loading && (
                        <div className="kk-mobile-menu__auth">
                            <Link to="/login" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Prijava</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Registracija</Link>
                        </div>
                    )}
                    {user && (
                        <div className="kk-mobile-menu__auth">
                            <Link to={`/profile/${user.id}`} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                <User size={16} /> Moj Profil
                            </Link>
                            <Link to="/teams" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                <Users size={16} /> Moj Tim
                            </Link>
                            {competitionActive && (
                                <Link to="/leaderboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Trophy size={16} /> Ljestvica
                                </Link>
                            )}
                            {user.isAdmin && (
                                <Link to="/admin" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Settings size={16} /> Admin Panel
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-outline-accent" style={{ width: '100%', justifyContent: 'center' }}>
                                <LogOut size={16} /> Odjava
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div className="kk-mobile-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            )}

            <style>{`
                .kk-navbar {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
                    height: var(--navbar-height);
                    transition: background var(--transition-base), box-shadow var(--transition-base), backdrop-filter var(--transition-base);
                }
                .kk-navbar--scrolled {
                    background: var(--glass-bg-strong);
                    backdrop-filter: var(--blur-lg);
                    -webkit-backdrop-filter: var(--blur-lg);
                    border-bottom: 1px solid var(--glass-border);
                    box-shadow: var(--shadow-md);
                }
                .kk-navbar__inner {
                    max-width: 1400px; margin: 0 auto; height: 100%;
                    padding: 0 20px; display: flex; align-items: center; gap: 16px;
                }
                .kk-navbar__brand {
                    display: flex; align-items: center; gap: 12px;
                    text-decoration: none; flex-shrink: 0;
                }
                .kk-navbar__logo {
                    width: 54px; height: 54px; object-fit: contain;
                    transition: transform var(--transition-base);
                }
                .kk-navbar__brand:hover .kk-navbar__logo { transform: rotate(15deg) scale(1.05); }
                .kk-navbar__name {
                    font-size: 1.6rem; color: var(--text-primary);
                    transition: color var(--transition-base);
                }
                .kk-navbar__brand:hover .kk-navbar__name { color: var(--accent); }
                .kk-navbar__links {
                    display: flex; align-items: center; gap: 2px;
                    list-style: none; flex: 1;
                }
                .kk-navbar__link {
                    display: block; padding: 7px 12px; font-size: 0.9rem; font-weight: 500;
                    color: var(--text-secondary); text-decoration: none;
                    border-radius: var(--radius-full); white-space: nowrap;
                    transition: color var(--transition-fast), background var(--transition-fast);
                }
                .kk-navbar__link:hover { color: var(--text-primary); background: var(--glass-bg); }
                .kk-navbar__link--active { color: var(--accent); background: var(--accent-soft); }
                .kk-navbar__link--highlight {
                    color: var(--accent); background: var(--accent-soft);
                    border: 1px solid var(--accent);
                    animation: glowPulse 2s ease-in-out infinite;
                }
                .kk-navbar__right {
                    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
                }
                .theme-toggle { position: relative; }
                .theme-toggle-icon {
                    position: absolute; font-size: 12px; top: 50%;
                    transform: translateY(-50%); pointer-events: none; line-height: 1;
                }
                .theme-toggle-icon--dark { left: 4px; }
                .theme-toggle-icon--light { right: 3px; }
                .kk-navbar__loading {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: var(--glass-bg-strong);
                }
                .kk-navbar__profile { position: relative; }
                .kk-navbar__avatar-btn {
                    display: flex; align-items: center; gap: 10px;
                    background: var(--glass-bg); border: 1px solid var(--glass-border);
                    border-radius: var(--radius-full); padding: 5px 14px 5px 5px;
                    cursor: pointer; color: var(--text-primary); font-size: 0.95rem;
                    font-weight: 500; transition: all var(--transition-fast);
                    font-family: var(--font-body);
                }
                .kk-navbar__avatar-btn:hover { background: var(--glass-bg-strong); border-color: var(--accent); }
                .kk-navbar__avatar {
                    width: 40px; height: 40px; border-radius: 50%; object-fit: cover;
                    border: 2px solid var(--accent);
                }
                .kk-navbar__username {
                    max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                    font-size: 0.875rem;
                }
                .kk-navbar__chevron-icon {
                    color: var(--text-secondary); transition: transform var(--transition-fast); flex-shrink: 0;
                }
                .kk-navbar__chevron-icon--open { transform: rotate(180deg); }
                .kk-dropdown {
                    position: absolute; top: calc(100% + 10px); right: 0;
                    min-width: 240px; background: var(--bg-elevated);
                    backdrop-filter: var(--blur-lg); -webkit-backdrop-filter: var(--blur-lg);
                    border: 1px solid var(--glass-border-strong);
                    border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
                    overflow: hidden; transform-origin: top right;
                }
                .kk-dropdown__header {
                    padding: 12px 16px; border-bottom: 1px solid var(--glass-border);
                }
                .kk-dropdown__greeting {
                    font-size: 0.85rem; font-weight: 600; color: var(--text-primary);
                }
                .kk-dropdown__list { list-style: none; padding: 6px; }
                .kk-dropdown__item {
                    display: flex; align-items: center; gap: 8px; width: 100%;
                    padding: 10px 16px; font-size: 0.9rem; font-weight: 500;
                    color: var(--text-secondary); text-decoration: none;
                    background: none; border: none; border-radius: var(--radius-sm);
                    cursor: pointer; transition: background var(--transition-fast), color var(--transition-fast);
                    font-family: var(--font-body); text-align: left;
                }
                .kk-dropdown__item:hover { background: var(--glass-bg); color: var(--text-primary); }
                .kk-dropdown__item--danger:hover { background: rgba(255,74,110,0.12); color: #ff4a6e; }
                .kk-dropdown__divider { height: 1px; background: var(--glass-border); margin: 4px 0; }
                .kk-navbar__auth { display: flex; align-items: center; gap: 10px; }
                .kk-navbar__auth-btn { padding: 9px 20px; font-size: 0.95rem; }
                .kk-hamburger {
                    display: none; flex-direction: column; justify-content: center; gap: 5px;
                    width: 36px; height: 36px; background: var(--glass-bg);
                    border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
                    cursor: pointer; padding: 6px; transition: background var(--transition-fast);
                }
                .kk-hamburger:hover { background: var(--glass-bg-strong); }
                .kk-hamburger span {
                    display: block; height: 2px; background: var(--text-primary);
                    border-radius: 2px;
                    transition: transform var(--transition-base), opacity var(--transition-base);
                    transform-origin: center;
                }
                .kk-hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
                .kk-hamburger--open span:nth-child(2) { opacity: 0; }
                .kk-hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
                .kk-mobile-menu {
                    position: fixed; top: var(--navbar-height); right: 0; bottom: 0; width: 280px;
                    background: var(--bg-elevated);
                    backdrop-filter: var(--blur-lg); -webkit-backdrop-filter: var(--blur-lg);
                    border-left: 1px solid var(--glass-border); z-index: 190;
                    transform: translateX(100%); transition: transform var(--transition-slow);
                    overflow-y: auto;
                }
                .kk-mobile-menu--open { transform: translateX(0); }
                .kk-mobile-menu__inner {
                    padding: 24px 20px; display: flex; flex-direction: column; gap: 8px; height: 100%;
                }
                .kk-mobile-menu__links { list-style: none; display: flex; flex-direction: column; gap: 4px; }
                .kk-mobile-menu__link {
                    display: block; padding: 12px 16px; font-size: 1rem; font-weight: 500;
                    color: var(--text-secondary); text-decoration: none;
                    border-radius: var(--radius-md);
                    transition: background var(--transition-fast), color var(--transition-fast);
                }
                .kk-mobile-menu__link:hover { background: var(--glass-bg); color: var(--text-primary); }
                .kk-mobile-menu__link--active { color: var(--accent); background: var(--accent-soft); }
                .kk-mobile-menu__link--highlight { color: var(--accent); background: var(--accent-soft); border: 1px solid var(--accent); }
                .kk-mobile-menu__auth {
                    display: flex; flex-direction: column; gap: 8px;
                    margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--glass-border);
                }
                .kk-mobile-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(2px); z-index: 180; animation: fadeIn 0.2s ease;
                }
                @media (max-width: 1024px) {
                    .kk-navbar__links { display: none; }
                    .kk-hamburger { display: flex; }
                    .kk-navbar__username { display: none; }
                    .kk-navbar__auth { display: none; }
                }
            `}</style>
        </>
    );
}

export default Navbar;
