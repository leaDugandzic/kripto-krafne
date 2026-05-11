import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Post = () => {
    const [naslov, setNaslov] = useState("");
    const [opis, setOpis] = useState("");
    const [kategorija, setKategorija] = useState("");
    const [kategorije, setKategorije] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getCategories.php", {
            method: "GET",
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setKategorije(data))
            .catch(err => console.error("Ne mogu učitati kategorije:", err));
    }, []);

    const handleObjavi = () => {
        if (!naslov.trim() || !opis.trim() || !kategorija) {
            alert("Molimo popunite sva polja!");
            return;
        }
        setSubmitting(true);
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/post.php", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ Naslov: naslov, Opis: opis, Kategorija: kategorija })
        })
            .then(async response => {
                const text = await response.text();
                try { return JSON.parse(text); }
                catch { throw new Error("Greška pri objavljivanju!"); }
            })
            .then((data) => {
                if (data?.success) {
                    setNaslov(""); setOpis(""); setKategorija("");
                    navigate("/forums");
                }
            })
            .catch(() => alert("Greška pri objavljivanju!"))
            .finally(() => setSubmitting(false));
    };

    const selectedKat = kategorije.find(k => k.id === kategorija);

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: 8
                    }}>
                        Novi post
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Podijelite svoje misli s kripto zajednicom
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '40px 44px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Naslov */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                                textTransform: 'uppercase', color: 'var(--accent)',
                                marginBottom: 10
                            }}>
                                Naslov objave
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Unesite naslov…"
                                value={naslov}
                                onChange={(e) => setNaslov(e.target.value)}
                            />
                        </div>

                        {/* Kategorija */}
                        <div style={{ position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                                textTransform: 'uppercase', color: 'var(--accent)',
                                marginBottom: 10
                            }}>
                                Kategorija
                            </label>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(o => !o)}
                                style={{
                                    width: '100%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '11px 16px',
                                    background: 'var(--glass-bg)',
                                    border: `1.5px solid ${dropdownOpen ? 'var(--accent)' : 'var(--glass-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    color: selectedKat ? 'var(--text-primary)' : 'var(--text-muted)',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                <span>{selectedKat ? selectedKat.category_name : "Odaberi kategoriju"}</span>
                                <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                            </button>
                            {dropdownOpen && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-lg)',
                                    zIndex: 50,
                                    overflow: 'hidden'
                                }}>
                                    {kategorije.map((k) => (
                                        <button
                                            key={k.id}
                                            type="button"
                                            onClick={() => { setKategorija(k.id); setDropdownOpen(false); }}
                                            style={{
                                                display: 'block', width: '100%',
                                                textAlign: 'left',
                                                padding: '10px 16px',
                                                background: kategorija === k.id ? 'var(--accent-soft)' : 'transparent',
                                                color: kategorija === k.id ? 'var(--accent)' : 'var(--text-secondary)',
                                                fontSize: '0.875rem',
                                                border: 'none', cursor: 'pointer',
                                                fontFamily: 'var(--font-body)',
                                                transition: 'background 0.1s'
                                            }}
                                            onMouseEnter={e => { if (kategorija !== k.id) e.currentTarget.style.background = 'var(--glass-bg)'; }}
                                            onMouseLeave={e => { if (kategorija !== k.id) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            {k.category_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sadržaj */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em',
                                textTransform: 'uppercase', color: 'var(--accent)',
                                marginBottom: 10
                            }}>
                                Sadržaj objave
                            </label>
                            <textarea
                                rows={8}
                                className="input"
                                style={{ resize: 'vertical', lineHeight: 1.6 }}
                                placeholder="Napišite sadržaj vašeg posta…"
                                value={opis}
                                onChange={(e) => setOpis(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleObjavi}
                                disabled={submitting}
                                style={{ padding: '12px 40px', fontSize: '1rem' }}
                            >
                                {submitting ? 'Objavljujem…' : 'Objavi'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
