import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Key, CheckCircle, Lock, Trophy, AlertCircle } from "lucide-react";

const donuts = [
    { id: 1, src: "../src/assets/img/yellow-donut.webp", code: "krafna{gl4z3d_s3cur1ty}", route: "/radnici", label: "Radnici" },
    { id: 2, src: "../src/assets/img/brown-drizzle-donut.webp", code: "krafna{d0ughnut_h4x}", route: "/recipe/1", label: "Recept" },
    { id: 3, src: "../src/assets/img/white-dotted-donut.webp", code: "krafna{3ncrypt3d_j3ly}", route: "/menu", label: "Tajni Meni" },
    { id: 4, src: "../src/assets/img/blue-donut.webp", code: "krafna{5ug4r_5pr1nkl3}", route: "/dragdrop", label: "Trezor" },
    { id: 5, src: "../src/assets/img/plain-donut.webp", code: "krafna{c1nnam0n_r0ll}", route: "/kolo", label: "Kolo Sreće" },
    { id: 6, src: "../src/assets/img/green-donut.webp", code: "krafna{f1ll3d_w1th_fl4g}", route: "/images", label: "Galerija" },
];

const BASE = "http://localhost/kripto-krafne/kripto-krafne/src/backend";

export default function DonutGame() {
    const [inputs, setInputs] = useState(Array(6).fill(""));
    const [validated, setValidated] = useState(Array(6).fill(false));
    const [shake, setShake] = useState(Array(6).fill(false));
    const [competitionActive, setCompetitionActive] = useState(false);
    const [inTeam, setInTeam] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [taskFeedback, setTaskFeedback] = useState(Array(6).fill(null)); // null | 'success' | 'error' | string

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const [teamRes, compRes] = await Promise.all([
                fetch(`${BASE}/teams/get_user_team.php`, { credentials: 'include' }),
                fetch(`${BASE}/competition_status.php`, { credentials: 'include' }),
            ]);
            const teamData = await teamRes.json();
            const compData = await compRes.json();

            if (compData.success) setCompetitionActive(Boolean(compData.is_active));

            if (teamData.success && teamData.in_team) {
                setInTeam(true);
                // Restore validated state from saved team progress
                if (Array.isArray(teamData.progress) && teamData.progress.length > 0) {
                    const restored = Array(6).fill(false);
                    teamData.progress.forEach(p => {
                        const idx = parseInt(p.task_number) - 1;
                        if (idx >= 0 && idx < 6) restored[idx] = true;
                    });
                    setValidated(restored);
                }
            }
        } catch (err) {
            console.error('Error loading progress:', err);
        } finally {
            setInitLoading(false);
        }
    };

    const setFeedback = (index, msg) => {
        setTaskFeedback(prev => { const n = [...prev]; n[index] = msg; return n; });
        setTimeout(() => setTaskFeedback(prev => { const n = [...prev]; n[index] = null; return n; }), 3000);
    };

    const handleValidation = async (index) => {
        if (validated[index]) return;

        const entered = inputs[index].trim().toLowerCase();
        const expected = donuts[index].code.toLowerCase();

        if (entered !== expected) {
            // Wrong code — shake
            setShake(prev => { const n = [...prev]; n[index] = true; return n; });
            setTimeout(() => setShake(prev => { const n = [...prev]; n[index] = false; return n; }), 500);
            setFeedback(index, 'wrong');
            return;
        }

        // Correct locally — mark immediately
        setValidated(prev => { const n = [...prev]; n[index] = true; return n; });
        setFeedback(index, 'correct');

        // Persist to backend (requires active competition + being in a team)
        if (!competitionActive) {
            setFeedback(index, 'nocomp');
            return;
        }
        if (!inTeam) {
            setFeedback(index, 'noteam');
            return;
        }

        try {
            const res = await fetch(`${BASE}/ctf/submit_task.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_number: index + 1, code: donuts[index].code }),
            });
            const data = await res.json();
            if (data.success) {
                setFeedback(index, `+100 bodova! Tim: ${data.team_score} ukupno`);
            } else if (data.message?.toLowerCase().includes('already')) {
                // Team already solved this — still show as validated
                setFeedback(index, 'already');
            } else {
                setFeedback(index, data.message || 'Greška pri slanju');
            }
        } catch {
            // Network error — local state stays validated, backend just couldn't record
        }
    };

    const completedCount = validated.filter(Boolean).length;
    const allDone = completedCount === donuts.length;

    if (initLoading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
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
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="../src/assets/img/castle.png"
                            alt="Castle"
                            style={{ width: 48, filter: 'drop-shadow(0 0 10px var(--accent-glow))' }}
                        />
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, var(--accent), var(--yellow), var(--orange))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 10,
                        lineHeight: 1.1,
                        textShadow: 'none'
                    }}>
                        Kraljevstvo Krafni
                    </h1>
                    {/* Sprinkle row */}
                    <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16, marginTop: -6 }}>
                        {['#ff2d78','#ffc840','#ff7b35','#b845f5','#ffc840','#ff7b35','#ff2d78'].map((c, i) => (
                            <div key={i} style={{ width: 22, height: 5, borderRadius: 3, background: c, opacity: 0.65, transform: `rotate(${[-7,4,-5,6,-4,5,-6][i]}deg)` }} />
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: 20 }}>
                        Pronađi skrivene šifre u svakom izazovu i unesi ih ovdje
                    </p>

                    {/* Status pills */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                        <span style={{
                            padding: '4px 12px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem', fontWeight: 700,
                            background: competitionActive ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)',
                            border: `1px solid ${competitionActive ? 'rgba(34,197,94,0.35)' : 'rgba(234,179,8,0.35)'}`,
                            color: competitionActive ? 'var(--success)' : '#ca8a04'
                        }}>
                            {competitionActive ? '● Natjecanje aktivno' : '○ Natjecanje nije aktivno'}
                        </span>
                        {!inTeam && (
                            <span style={{
                                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem', fontWeight: 700,
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: 'var(--error)'
                            }}>
                                Nisi u timu — rješenja se neće bilježiti
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 280 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {allDone
                                ? <Trophy size={18} style={{ color: '#f59e0b' }} />
                                : <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                            }
                            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: allDone ? '#f59e0b' : 'var(--text-secondary)' }}>
                                {completedCount} / {donuts.length} izazova riješeno
                                {allDone && ' — Bravo!'}
                            </span>
                        </div>
                        <div style={{
                            width: 280, height: 6,
                            background: 'var(--glass-border)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(completedCount / donuts.length) * 100}%`,
                                background: allDone
                                    ? 'linear-gradient(90deg, #f59e0b, var(--accent))'
                                    : 'linear-gradient(90deg, var(--accent), var(--purple))',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Challenge grid */}
                <div className="donut-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 20
                }}>
                    {donuts.map((donut, index) => {
                        const done = validated[index];
                        const feedback = taskFeedback[index];
                        const cardColors = [
                            { accent: '#ff2d78', soft: 'rgba(255,45,120,0.08)',  glow: 'rgba(255,45,120,0.18)' },
                            { accent: '#ffc840', soft: 'rgba(255,200,64,0.08)',  glow: 'rgba(255,200,64,0.18)' },
                            { accent: '#ff7b35', soft: 'rgba(255,123,53,0.08)',  glow: 'rgba(255,123,53,0.18)' },
                            { accent: '#b845f5', soft: 'rgba(184,69,245,0.08)',  glow: 'rgba(184,69,245,0.18)' },
                            { accent: '#ff2d78', soft: 'rgba(255,45,120,0.08)',  glow: 'rgba(255,45,120,0.18)' },
                            { accent: '#ffc840', soft: 'rgba(255,200,64,0.08)',  glow: 'rgba(255,200,64,0.18)' },
                        ];
                        const cc = cardColors[index];
                        return (
                            <div
                                key={donut.id}
                                className="glass-card"
                                style={{
                                    padding: '28px 22px 22px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 16,
                                    border: `1.5px solid ${done ? 'var(--success)' : cc.accent + '55'}`,
                                    background: done ? 'rgba(34,197,94,0.05)' : cc.soft,
                                    boxShadow: done ? '0 0 24px rgba(34,197,94,0.1)' : `0 0 20px ${cc.glow}`,
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    position: 'relative'
                                }}
                            >
                                {/* Task badge */}
                                <div style={{
                                    position: 'absolute', top: 14, right: 14,
                                    width: 28, height: 28,
                                    borderRadius: '50%',
                                    background: done ? 'var(--success)' : cc.accent + '22',
                                    border: `1.5px solid ${done ? 'var(--success)' : cc.accent}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.72rem', fontWeight: 800,
                                    color: done ? 'white' : cc.accent
                                }}>
                                    {done ? <CheckCircle size={14} /> : index + 1}
                                </div>

                                {/* Donut image */}
                                <Link to={donut.route} style={{ display: 'block' }}>
                                    <motion.img
                                        src={donut.src}
                                        alt={donut.label}
                                        style={{
                                            width: 'clamp(80px, 10vw, 110px)',
                                            filter: done
                                                ? 'drop-shadow(0 0 20px rgba(34,197,94,0.5))'
                                                : 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))',
                                            transition: 'filter 0.3s'
                                        }}
                                        animate={done ? { rotate: [0, 360] } : {}}
                                        transition={done ? { duration: 1 } : {}}
                                        whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 18px var(--accent-glow))' }}
                                    />
                                </Link>

                                {/* Challenge label */}
                                <Link to={donut.route} style={{
                                    fontSize: '0.78rem', fontWeight: 700,
                                    letterSpacing: '0.06em', textTransform: 'uppercase',
                                    color: 'var(--text-muted)', textDecoration: 'none',
                                    transition: 'color 0.15s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {donut.label} →
                                </Link>

                                {/* Input + button */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                                    <motion.input
                                        type="text"
                                        value={inputs[index]}
                                        onChange={(e) => {
                                            if (done) return;
                                            const n = [...inputs];
                                            n[index] = e.target.value;
                                            setInputs(n);
                                        }}
                                        placeholder="krafna{...}"
                                        disabled={done}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1.5px solid ${done ? 'var(--success)' : shake[index] ? 'var(--error)' : 'var(--glass-border)'}`,
                                            background: done ? 'rgba(34,197,94,0.08)' : 'var(--bg-elevated)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.8rem',
                                            fontFamily: 'monospace',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        animate={shake[index] ? { x: [-6, 6, -6, 6, 0] } : {}}
                                        transition={{ duration: 0.25 }}
                                        onKeyDown={(e) => e.key === 'Enter' && !done && handleValidation(index)}
                                    />
                                    <button
                                        onClick={() => handleValidation(index)}
                                        disabled={done}
                                        style={{
                                            width: 36, height: 36, flexShrink: 0,
                                            borderRadius: 'var(--radius-md)',
                                            background: done ? 'var(--success)' : 'var(--accent)',
                                            border: 'none',
                                            color: 'white',
                                            cursor: done ? 'default' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: done ? '0 0 12px rgba(34,197,94,0.4)' : '0 0 12px var(--accent-glow)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {done ? <CheckCircle size={16} /> : <Key size={16} />}
                                    </button>
                                </div>

                                {/* Feedback message */}
                                {feedback && (
                                    <p style={{
                                        fontSize: '0.75rem', fontWeight: 600,
                                        color: feedback === 'wrong'
                                            ? 'var(--error)'
                                            : feedback === 'nocomp' || feedback === 'noteam'
                                                ? '#ca8a04'
                                                : 'var(--success)',
                                        textAlign: 'center',
                                        display: 'flex', alignItems: 'center', gap: 4
                                    }}>
                                        {feedback === 'wrong' && <><AlertCircle size={12} /> Pogrešna šifra!</>}
                                        {feedback === 'correct' && <><CheckCircle size={12} /> Točno!</>}
                                        {feedback === 'nocomp' && <><AlertCircle size={12} /> Natjecanje nije aktivno</>}
                                        {feedback === 'noteam' && <><AlertCircle size={12} /> Pridruži se timu da bi se bilježilo</>}
                                        {feedback === 'already' && <><CheckCircle size={12} /> Tim je već riješio ovaj zadatak</>}
                                        {!['wrong','correct','nocomp','noteam','already'].includes(feedback) && feedback}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* All done banner */}
                {allDone && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: 40,
                            padding: '28px 32px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(255,45,120,0.08))',
                            border: '1.5px solid rgba(245,158,11,0.4)',
                            textAlign: 'center'
                        }}
                    >
                        <Trophy size={36} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.6rem', fontWeight: 800,
                            color: 'var(--text-primary)', marginBottom: 8
                        }}>
                            Čestitamo! Sve šifre pronađene!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Uspješno si prošao/la sve izazove Kraljevstva Krafni.
                        </p>
                    </motion.div>
                )}
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .donut-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 520px) {
                    .donut-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
