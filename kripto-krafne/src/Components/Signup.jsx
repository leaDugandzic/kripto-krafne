import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ime, setIme] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccess("");
        setLoading(true);

        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/signup.php", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ Ime: ime, Password: password, Email: email, ConfirmPass: confirmPassword }),
        })
            .then(async response => {
                const text = await response.text();
                try { return JSON.parse(text); }
                catch { throw new Error("Invalid JSON response from backend"); }
            })
            .then((data) => {
                if (data.success) {
                    setSuccess("Signup successful! Redirecting…");
                    setTimeout(() => { window.location.href = '/login'; }, 1200);
                } else {
                    setMessage(data.message);
                }
            })
            .catch(() => setMessage("Server error. Please try again."))
            .finally(() => setLoading(false));
    };

    const passwordStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strengthLabel = ['', 'Slaba', 'Osrednja', 'Dobra', 'Odlična'];
    const strengthColor = ['', 'var(--error)', 'var(--warning)', '#60d394', 'var(--success)'];
    const strength = passwordStrength();

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <div className="auth-card__ring" aria-hidden="true" />

                <div className="auth-card__header">
                    <div className="auth-card__icon">🍩</div>
                    <h1 className="auth-card__title display-font">Registriraj se</h1>
                    <p className="auth-card__subtitle">Pridruži se Kripto Krafne zajednici!</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="auth-form__field">
                        <label className="auth-form__label">Korisničko ime</label>
                        <input
                            type="text"
                            value={ime}
                            onChange={(e) => setIme(e.target.value)}
                            placeholder="tvoje_ime"
                            className="input"
                            autoComplete="username"
                        />
                    </div>

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
                                autoComplete="new-password"
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
                        {password && (
                            <div className="auth-form__strength">
                                <div className="auth-form__strength-bar">
                                    {[1,2,3,4].map(i => (
                                        <div
                                            key={i}
                                            className="auth-form__strength-seg"
                                            style={{ background: i <= strength ? strengthColor[strength] : 'var(--glass-border)' }}
                                        />
                                    ))}
                                </div>
                                <span style={{ color: strengthColor[strength], fontSize: '0.75rem', fontWeight: 600 }}>
                                    {strengthLabel[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="auth-form__field">
                        <label className="auth-form__label">Ponovite lozinku</label>
                        <div className="auth-form__password-wrap">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="auth-form__eye"
                                onClick={() => setShowConfirm(s => !s)}
                                aria-label={showConfirm ? "Hide" : "Show"}
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--error)' }}>Lozinke se ne podudaraju</span>
                        )}
                    </div>

                    {message && <p className="auth-form__error">{message}</p>}
                    {success && <p className="auth-form__success">{success}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-form__submit"
                        disabled={loading}
                    >
                        {loading ? <span className="auth-form__spinner" /> : null}
                        {loading ? 'Registracija…' : 'Registriraj se'}
                    </button>

                    <p className="auth-form__footer-text">
                        Već imaš račun?{' '}
                        <Link to="/login" className="auth-form__link">Prijavi se</Link>
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
                    border: 1px solid var(--accent-soft);
                    top: -100px;
                    right: -80px;
                    pointer-events: none;
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
                    background: linear-gradient(135deg, var(--text-primary), var(--accent));
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
                .auth-form__strength {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 6px;
                }
                .auth-form__strength-bar {
                    display: flex;
                    gap: 4px;
                    flex: 1;
                }
                .auth-form__strength-seg {
                    height: 4px;
                    flex: 1;
                    border-radius: 2px;
                    transition: background 0.3s ease;
                }
                @media (max-width: 480px) {
                    .auth-card { padding: 32px 24px; }
                    .auth-card__title { font-size: 1.7rem; }
                }
            `}</style>
        </div>
    );
}
