import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        decodeJWT(token);
        setLoading(true);
        try {
            const res = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token }),
            });
            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch {
                setError("Server returned invalid data.");
                return;
            }
            if (data.success) {
                setMessage("Google login successful!");
                setTimeout(() => { window.location.href = '/'; }, 1000);
            } else {
                setError(data.message || "Google login failed.");
            }
        } catch {
            setError("Network or server error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        setLoading(true);
        try {
            const response = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/login.php", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ Email: email, Password: password }),
            });
            const text = await response.text();
            let jsonData;
            try { jsonData = JSON.parse(text); } catch {
                setError("Server error - check console for details");
                return;
            }
            if (jsonData.success) {
                setMessage("Login successful!");
                if (jsonData.new_achievements?.length > 0) {
                    sessionStorage.setItem('kk-pending-achievements', JSON.stringify(jsonData.new_achievements));
                }
                setTimeout(() => { window.location.href = '/'; }, 1000);
            } else {
                setError(jsonData.message || "Login failed");
            }
        } catch {
            setError("Network error - make sure XAMPP is running");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                {/* Decorative rings */}
                <div className="auth-card__ring" aria-hidden="true" />
                <div className="auth-card__ring auth-card__ring--yellow" aria-hidden="true" />
                {/* Sprinkle dashes */}
                <div className="auth-card__sprinkles" aria-hidden="true">
                    {[
                        { l: '12%', t: '18%', rot: 35,  c: '#ffc840' },
                        { l: '82%', t: '12%', rot: -22, c: '#ff7b35' },
                        { l: '88%', t: '72%', rot: 55,  c: '#ff2d78' },
                        { l: '8%',  t: '78%', rot: -40, c: '#b845f5' },
                        { l: '50%', t: '6%',  rot: 70,  c: '#ffc840' },
                        { l: '92%', t: '42%', rot: -60, c: '#ff7b35' },
                        { l: '5%',  t: '48%', rot: 48,  c: '#ff2d78' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: s.l, top: s.t,
                            width: 4, height: 13, borderRadius: 3,
                            background: s.c, opacity: 0.45,
                            transform: `rotate(${s.rot}deg)`,
                            pointerEvents: 'none'
                        }} />
                    ))}
                </div>

                <div className="auth-card__header">
                    <div className="auth-card__icon">🍩</div>
                    <h1 className="auth-card__title display-font">Ulogiraj se</h1>
                    <p className="auth-card__subtitle">Dobrodošla nazad, hakeru!</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="auth-form__field">
                        <label className="auth-form__label">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tvoj@email.com"
                            className="input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-form__field">
                        <label className="auth-form__label">Lozinka</label>
                        <div className="auth-form__password-wrap">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="auth-form__eye"
                                onClick={() => setShowPassword(s => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-form__error">{error}</p>}
                    {message && <p className="auth-form__success">{message}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-form__submit"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-form__spinner" /> : null}
                        {loading ? 'Prijava…' : 'Prijavi se'}
                    </button>

                    <div className="auth-form__divider">
                        <span>ili nastavi s</span>
                    </div>

                    <div className="auth-form__google">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google login failed")}
                        />
                    </div>

                    <p className="auth-form__footer-text">
                        Nemaš račun?{' '}
                        <Link to="/signup" className="auth-form__link">Registriraj se</Link>
                    </p>
                </form>
            </div>

            <style>{`
                .auth-page {
                    min-height: calc(100vh - var(--navbar-height));
                    padding-top: calc(var(--navbar-height) + 48px);
                    padding-bottom: 80px;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-left: 16px;
                    padding-right: 16px;
                }

                .auth-card {
                    width: 100%;
                    max-width: 460px;
                    padding: 48px 40px;
                    position: relative;
                    overflow: hidden;
                }

                .auth-card__ring {
                    position: absolute;
                    width: 280px;
                    height: 280px;
                    border-radius: 50%;
                    border: 1.5px solid var(--accent-soft);
                    top: -100px;
                    right: -80px;
                    pointer-events: none;
                    animation: rotateDonut 18s linear infinite;
                }

                .auth-card__ring--yellow {
                    width: 200px;
                    height: 200px;
                    border-color: var(--yellow-soft);
                    top: auto;
                    bottom: -60px;
                    left: -60px;
                    right: auto;
                    animation: rotateDonut 24s linear infinite reverse;
                }

                .auth-card__sprinkles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    border-radius: inherit;
                }

                .auth-card__header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .auth-card__icon {
                    font-size: 2.8rem;
                    margin-bottom: 12px;
                    animation: float 4s ease-in-out infinite;
                    display: inline-block;
                }

                .auth-card__title {
                    font-size: 2rem;
                    background: linear-gradient(135deg, var(--accent), var(--yellow), var(--orange));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 6px;
                }

                .auth-card__subtitle {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .auth-form__field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .auth-form__label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .auth-form__password-wrap {
                    position: relative;
                }

                .auth-form__password-wrap .input {
                    padding-right: 44px;
                }

                .auth-form__eye {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    transition: color var(--transition-fast);
                    padding: 0;
                }
                .auth-form__eye:hover { color: var(--accent); }

                .auth-form__error {
                    font-size: 0.85rem;
                    color: var(--error);
                    background: rgba(255, 74, 110, 0.1);
                    border: 1px solid rgba(255, 74, 110, 0.25);
                    border-radius: var(--radius-sm);
                    padding: 8px 12px;
                    text-align: center;
                }

                .auth-form__success {
                    font-size: 0.85rem;
                    color: var(--success);
                    background: rgba(0, 229, 160, 0.1);
                    border: 1px solid rgba(0, 229, 160, 0.25);
                    border-radius: var(--radius-sm);
                    padding: 8px 12px;
                    text-align: center;
                }

                .auth-form__submit {
                    width: 100%;
                    justify-content: center;
                    padding: 13px;
                    font-size: 0.95rem;
                    margin-top: 4px;
                    gap: 8px;
                }

                .auth-form__spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: rotateDonut 0.7s linear infinite;
                    display: inline-block;
                }

                .auth-form__divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                .auth-form__divider::before,
                .auth-form__divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--glass-border);
                }

                .auth-form__google {
                    display: flex;
                    justify-content: center;
                }

                .auth-form__footer-text {
                    text-align: center;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-top: 4px;
                }

                .auth-form__link {
                    color: var(--accent);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color var(--transition-fast);
                }
                .auth-form__link:hover { color: var(--accent-hover); text-decoration: underline; }

                @media (max-width: 480px) {
                    .auth-card { padding: 32px 24px; }
                    .auth-card__title { font-size: 1.7rem; }
                }
            `}</style>
        </div>
    );
}
