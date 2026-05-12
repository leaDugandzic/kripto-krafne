import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Heart, ChevronRight } from "lucide-react";

const Forums = () => {
    const [posts, setPosts] = useState([]);
    const [kategorije, setKategorije] = useState([]);
    const [odabranaKategorija, setOdabranaKategorija] = useState("sve");
    const [ucitavaSe, setUcitavaSe] = useState(true);

    useEffect(() => { ucitajPodatke(); }, []);

    const ucitajPodatke = async () => {
        try {
            setUcitavaSe(true);
            const [katRes, postRes] = await Promise.all([
                fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getCategories.php", { credentials: "include" }),
                fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getPosts.php", { credentials: "include" }),
            ]);
            const katData = await katRes.json();
            const postData = await postRes.json();
            setKategorije(katData.categories || katData);
            setPosts(postData.posts || postData);
        } catch (err) {
            console.error("Greška pri učitavanju:", err);
        } finally {
            setUcitavaSe(false);
        }
    };

    const filtriraniPostovi = odabranaKategorija === "sve"
        ? posts
        : posts.filter(post => post.category_id == odabranaKategorija);

    const formatirajDatum = (datumString) => {
        return new Date(datumString).toLocaleDateString('hr-HR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const likePost = async (postId) => {
        try {
            const response = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/likePost.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: postId })
            });
            const data = await response.json();
            if (data.success) {
                setPosts(prev => prev.map(p => p.id === postId
                    ? { ...p, likes: data.likes, liked: data.action === "liked" }
                    : p
                ));
            }
        } catch (err) {
            console.error("Greška kod like-a:", err);
        }
    };

    if (ucitavaSe) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
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
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--accent), var(--yellow), var(--orange))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: 8
                    }}>
                        KriptoKrafne Forum
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        Raspravljajte s našom zajednicom!
                    </p>
                    {/* Colourful sprinkle bar */}
                    <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 14 }}>
                        {['#ff2d78','#ffc840','#ff7b35','#b845f5','#ffc840','#ff2d78','#ff7b35'].map((c, i) => (
                            <div key={i} style={{
                                width: 24, height: 5, borderRadius: 3, background: c, opacity: 0.65,
                                transform: `rotate(${[-6,5,-7,4,-5,7,-4][i]}deg)`
                            }} />
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
                    {/* Category sidebar */}
                    <div className="glass-card" style={{ padding: 20, position: 'sticky', top: 88 }}>
                        <h2 style={{
                            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16
                        }}>
                            Kategorije
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[{ id: 'sve', category_name: 'Sve kategorije' }, ...kategorije].map((kat) => {
                                const active = odabranaKategorija == kat.id;
                                return (
                                    <button
                                        key={kat.id}
                                        onClick={() => setOdabranaKategorija(kat.id)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '10px 14px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid',
                                            borderColor: active ? 'var(--accent)' : 'transparent',
                                            background: active ? 'var(--accent-soft)' : 'transparent',
                                            color: active ? 'var(--accent)' : 'var(--text-secondary)',
                                            fontWeight: active ? 600 : 400,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                                    >
                                        {kat.category_name}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--glass-border)' }}>
                            <Link to="/post">
                                <button style={{
                                    width: '100%', fontSize: '0.875rem', fontWeight: 700,
                                    padding: '10px 20px', borderRadius: 'var(--radius-full)',
                                    border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, var(--accent), var(--orange))',
                                    color: '#fff',
                                    boxShadow: '0 0 18px var(--orange-glow)',
                                    transition: 'opacity 0.2s, transform 0.2s',
                                    fontFamily: 'var(--font-body)'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}>
                                    + Novi post
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Posts column */}
                    <div>
                        {/* Filter header */}
                        <div className="glass-card" style={{ padding: '16px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                    {odabranaKategorija === "sve" ? "Svi postovi" : kategorije.find(k => k.id == odabranaKategorija)?.category_name}
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                    {filtriraniPostovi.length} od {posts.length} postova
                                </p>
                            </div>
                        </div>

                        {/* Post list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {filtriraniPostovi.length === 0 ? (
                                <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</p>
                                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Nema postova</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {odabranaKategorija === "sve" ? "Još nema objavljenih postova. Budite prvi!" : "Nema postova u ovoj kategoriji."}
                                    </p>
                                </div>
                            ) : (
                                filtriraniPostovi.map((post) => (
                                    <div key={post.id} className="glass-card" style={{
                                        padding: '24px 28px',
                                        transition: 'border-color 0.2s, transform 0.2s',
                                        cursor: 'default'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none'; }}
                                    >
                                        <div style={{ marginBottom: 12 }}>
                                            <h3 style={{
                                                fontSize: '1.1rem', fontWeight: 700,
                                                color: 'var(--text-primary)', marginBottom: 8
                                            }}>
                                                {post.title}
                                            </h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {(() => {
                                                    const colors = [
                                                        { bg: 'var(--accent-soft)',  fg: 'var(--accent)'  },
                                                        { bg: 'var(--yellow-soft)',  fg: 'var(--yellow)'  },
                                                        { bg: 'var(--orange-soft)',  fg: 'var(--orange)'  },
                                                        { bg: 'var(--purple-soft)',  fg: 'var(--purple)'  },
                                                    ];
                                                    const c = colors[post.id % colors.length];
                                                    return (
                                                        <span style={{
                                                            background: c.bg, color: c.fg,
                                                            padding: '2px 10px', borderRadius: 'var(--radius-full)',
                                                            fontWeight: 600, fontSize: '0.72rem',
                                                            border: `1px solid ${c.fg}55`
                                                        }}>
                                                            {post.category_name || "Nepoznato"}
                                                        </span>
                                                    );
                                                })()}
                                                <span>·</span>
                                                {post.user_numeric_id ? (
                                                    <Link
                                                        to={`/profile/${post.user_numeric_id}`}
                                                        style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                    >
                                                        {post.user_name || post.user_id}
                                                    </Link>
                                                ) : (
                                                    <span>{post.user_id || 'Anoniman'}</span>
                                                )}
                                                <span>·</span>
                                                <span>{formatirajDatum(post.publish_date)}</span>
                                            </div>
                                        </div>

                                        <p style={{
                                            color: 'var(--text-secondary)', fontSize: '0.875rem',
                                            lineHeight: 1.65, marginBottom: 20,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {post.content}
                                        </p>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            paddingTop: 16, borderTop: '1px solid var(--glass-border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <Link to={`/forums/${post.id}`} style={{
                                                    display: 'flex', alignItems: 'center', gap: 5,
                                                    color: 'var(--text-muted)', fontSize: '0.825rem',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.15s'
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                                >
                                                    <MessageCircle size={14} /> Komentiraj
                                                </Link>
                                                <button
                                                    onClick={() => likePost(post.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: 5,
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: post.liked ? 'var(--accent)' : 'var(--text-muted)',
                                                        fontSize: '0.825rem',
                                                        transition: 'color 0.15s',
                                                        padding: 0
                                                    }}
                                                >
                                                    <Heart size={14} fill={post.liked ? 'var(--accent)' : 'none'} />
                                                    {post.likes ?? 0}
                                                </button>
                                            </div>
                                            <Link
                                                to={`/forums/${post.id}`}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 4,
                                                    color: 'var(--accent)', fontWeight: 600, fontSize: '0.825rem',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Pročitaj više <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .forum-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Forums;
