import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';
import AvatarImage from './AvatarImage';
import Logo from '../assets/img/logo.png';

function placementColor(n) {
    if (n === 1) return '#f59e0b';
    if (n === 2) return '#94a3b8';
    if (n === 3) return '#cd7c3a';
    return 'var(--accent)';
}
function ordinalLabel(n) {
    if (n === 1) return '1. mjesto';
    if (n === 2) return '2. mjesto';
    if (n === 3) return '3. mjesto';
    return `${n}. mjesto`;
}
function PlacementIcon({ rank, size }) {
    const color = placementColor(rank);
    if (rank === 1) return <FaTrophy size={size} color={color} />;
    if (rank <= 3) return <FaMedal size={size} color={color} />;
    return <FaStar size={size} color={color} />;
}

function CertContent({ data }) {
    const { team, members, tasks_solved, total_tasks, placement, total_teams, competition } = data;
    const pColor = placementColor(placement);
    const fmtDate = (s) => s ? new Date(s).toLocaleDateString('hr-HR', { day: '2-digit', month: 'long', year: 'numeric' }) : null;
    const compDate = competition?.end_time ? fmtDate(competition.end_time) : fmtDate(new Date().toISOString());

    return (
        <div id="cert-printable" style={{
            background: '#fff',
            border: `3px solid ${pColor}`,
            borderRadius: 16,
            padding: '44px 52px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 700,
            width: '100%',
        }}>
            {/* Corner decorations */}
            {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                <div key={`${v}${h}`} style={{
                    position: 'absolute',
                    [v]: 14, [h]: 14,
                    width: 40, height: 40,
                    borderTop: v === 'top' ? `3px solid ${pColor}` : 'none',
                    borderBottom: v === 'bottom' ? `3px solid ${pColor}` : 'none',
                    borderLeft: h === 'left' ? `3px solid ${pColor}` : 'none',
                    borderRight: h === 'right' ? `3px solid ${pColor}` : 'none',
                    opacity: 0.7,
                }} />
            ))}

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <img src={Logo} alt="" style={{ width: 32 }} />
                <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.05em', color: '#1a1a2e' }}>KRIPTO KRAFNE</span>
            </div>

            <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>
                ovim se potvrđuje da je tim
            </p>

            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: pColor, marginBottom: 20, fontFamily: 'var(--font-display)' }}>
                {team.name}
            </h2>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${pColor}, transparent)`, maxWidth: 360, margin: '0 auto 20px' }} />

            <div style={{ marginBottom: 8 }}><PlacementIcon rank={placement} size={48} /></div>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: pColor, marginBottom: 4 }}>{ordinalLabel(placement)}</p>
            <p style={{ fontSize: '0.825rem', color: '#6b7280', marginBottom: 28 }}>od {total_teams} timova</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
                {[{ label: 'Riješeni zadaci', value: `${tasks_solved}/${total_tasks}` }, { label: 'Ukupni bodovi', value: team.score }].map(s => (
                    <div key={s.label} style={{ padding: '14px 24px', borderRadius: 10, background: '#f8f9fa', border: '1px solid #e5e7eb', minWidth: 120 }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a2e' }}>{s.value}</p>
                        <p style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>Članovi tima</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
                {members.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <AvatarImage avatarKey={m.avatar} size={52} style={{ border: `2px solid ${m.is_captain ? pColor : '#e5e7eb'}` }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a1a2e' }}>{m.username}</span>
                        {m.is_captain && <span style={{ fontSize: '0.6rem', color: pColor, fontWeight: 700, letterSpacing: '0.06em' }}>KAPETAN</span>}
                    </div>
                ))}
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${pColor}, transparent)`, maxWidth: 360, margin: '0 auto 16px' }} />
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{compDate}</p>
        </div>
    );
}

export default function CertificatePopup() {
    const [visible, setVisible] = useState(false);
    const [certData, setCertData] = useState(null);
    const [compId, setCompId] = useState(null);
    const checkedRef = useRef(false);

    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;

        fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/check_certificate.php', { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
                if (!d.show) return;
                setCompId(d.competition_id);
                const url = `http://localhost/kripto-krafne/kripto-krafne/src/backend/certificate.php?competition_id=${d.competition_id}&team_id=${d.team_id}`;
                return fetch(url, { credentials: 'include' }).then(r => r.json());
            })
            .then(d => { if (d?.success) { setCertData(d); setVisible(true); } })
            .catch(console.error);
    }, []);

    const handleClose = () => {
        setVisible(false);
        if (compId) {
            fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/mark_certificate_seen.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ competition_id: compId }),
            }).catch(console.error);
        }
    };

    if (!visible || !certData) return null;

    return createPortal(
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.82)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 24, overflowY: 'auto',
        }}>
            {/* Congrats header */}
            <div className="cert-no-print" style={{ textAlign: 'center', marginBottom: 24 }}>
                <p style={{ fontSize: '2.2rem', marginBottom: 8 }}>🎉</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                    Čestitamo!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.925rem' }}>
                    Natjecanje je završeno — evo vašeg certifikata
                </p>
            </div>

            <CertContent data={certData} />

            {/* Action buttons */}
            <div className="cert-no-print" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.925rem', padding: '12px 28px' }}
                >
                    <Printer size={16} /> Spremi / Ispiši PDF
                </button>
                <button
                    onClick={handleClose}
                    className="btn btn-ghost"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.2)', fontSize: '0.925rem', padding: '12px 28px' }}
                >
                    <X size={16} /> Zatvori
                </button>
            </div>
            <p className="cert-no-print" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 14 }}>
                Certifikat možeš pronaći na svom profilu
            </p>

            {/* Print styles — visibility approach so children can override */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #cert-printable,
                    #cert-printable * { visibility: visible !important; color-adjust: exact; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    #cert-printable {
                        position: fixed !important;
                        inset: 30px !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        background: #fff !important;
                    }
                    .cert-no-print { display: none !important; }
                }
            `}</style>
        </div>,
        document.body
    );
}
