import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Send } from "lucide-react";
import CommentsLayout from "./CommentsLayout";

const PostLayout = () => {
    const { postid } = useParams();
    const [post, setPost] = useState(null);
    const [ucitavaSe, setUcitavaSe] = useState(true);
    const [greska, setGreska] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        ucitajPost();
        ucitajKomentare();
    }, [postid]);

    const ucitajKomentare = async () => {
        try {
            const response = await fetch(
                `http://localhost/kripto-krafne/kripto-krafne/src/backend/getComments.php?post_id=${postid}`,
                { credentials: "include" }
            );
            const data = await response.json();
            if (data.success) setComments(data.comments);
        } catch (err) {
            console.error("Greška pri učitavanju komentara:", err);
        }
    };

    const handleObjavi = () => {
        if (!comment.trim()) { alert("Molimo popunite polje!"); return; }
        setSubmitting(true);
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/comments.php", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ Komentar: comment, PostId: postid })
        })
            .then(async response => {
                const text = await response.text();
                try { return JSON.parse(text); }
                catch { throw new Error("Greška!"); }
            })
            .then((data) => {
                if (data?.success) { setComment(""); ucitajKomentare(); }
            })
            .catch(() => alert("Greška pri objavljivanju!"))
            .finally(() => setSubmitting(false));
    };

    const handleLike = async () => {
        try {
            const res = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/likePost.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ post_id: postid }),
            });
            const data = await res.json();
            if (data.success) {
                setLikes(data.likes);
                setLiked(data.action === "liked");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const ucitajPost = async () => {
        try {
            setUcitavaSe(true);
            setGreska(null);
            const response = await fetch(
                `http://localhost/kripto-krafne/kripto-krafne/src/backend/getPost.php?post_id=${postid}`,
                { method: "GET", credentials: "include" }
            );
            const data = await response.json();
            if (data.success) {
                setPost(data.post);
                setLikes(data.post.likes ?? 0);
                setLiked(Boolean(data.post.liked));
            } else {
                setGreska(data.message || "Post nije pronađen");
            }
        } catch (err) {
            setGreska("Došlo je do greške pri učitavanju posta");
        } finally {
            setUcitavaSe(false);
        }
    };

    const formatirajDatum = (datumString) => {
        return new Date(datumString).toLocaleDateString('hr-HR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
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

    if (greska || !post) {
        return (
            <div className="page-wrapper">
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <div className="glass-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                        <p style={{ fontSize: '3rem', marginBottom: 16 }}>{greska ? '😕' : '📝'}</p>
                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                            {greska || 'Post nije pronađen'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.875rem' }}>
                            {greska || 'Traženi post ne postoji ili je obrisan.'}
                        </p>
                        <Link to="/forums">
                            <button className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                <ArrowLeft size={16} /> Natrag na forum
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                {/* Back link */}
                <Link to="/forums" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500,
                    textDecoration: 'none', marginBottom: 28,
                    transition: 'color 0.15s'
                }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ArrowLeft size={16} /> Natrag na forum
                </Link>

                {/* Post card */}
                <article className="glass-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
                    <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <span style={{
                                background: 'var(--accent-soft)', color: 'var(--accent)',
                                padding: '3px 12px', borderRadius: 'var(--radius-full)',
                                fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.06em'
                            }}>
                                {post.category_name}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>·</span>
                            {post.user_numeric_id ? (
                                <Link
                                    to={`/profile/${post.user_numeric_id}`}
                                    style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    {post.user_name || post.user_id}
                                </Link>
                            ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{post.user_id || 'Anoniman'}</span>
                            )}
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>·</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{formatirajDatum(post.publish_date)}</span>
                        </div>
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            lineHeight: 1.2
                        }}>
                            {post.title}
                        </h1>
                    </div>

                    <div style={{ padding: '28px 32px' }}>
                        {post.content.split('\n').map((paragraph, index) => (
                            <p key={index} style={{
                                color: 'var(--text-secondary)', lineHeight: 1.75,
                                fontSize: '0.95rem', marginBottom: 16
                            }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div style={{
                        padding: '16px 32px',
                        borderTop: '1px solid var(--glass-border)',
                        background: 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', gap: 16
                    }}>
                        <button
                            onClick={handleLike}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                background: liked ? 'var(--accent-soft)' : 'transparent',
                                border: `1px solid ${liked ? 'var(--accent)' : 'var(--glass-border)'}`,
                                borderRadius: 'var(--radius-full)',
                                padding: '6px 14px',
                                color: liked ? 'var(--accent)' : 'var(--text-muted)',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            <Heart size={14} fill={liked ? 'var(--accent)' : 'none'} />
                            {likes}
                        </button>
                    </div>
                </article>

                {/* Comments section */}
                <div className="glass-card" style={{ padding: '28px 32px' }}>
                    <h3 style={{
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--text-primary)', marginBottom: 20
                    }}>
                        Komentari ({comments.length})
                    </h3>

                    {/* Comment input */}
                    <div style={{ marginBottom: 28 }}>
                        <textarea
                            rows={4}
                            className="input"
                            style={{ resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }}
                            placeholder="Napišite komentar…"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleObjavi}
                            disabled={submitting}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px' }}
                        >
                            <Send size={14} />
                            {submitting ? 'Objavljujem…' : 'Objavi komentar'}
                        </button>
                    </div>

                    {/* Comments list */}
                    {comments.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0', fontSize: '0.875rem' }}>
                            Još nema komentara. Budi prvi! 💬
                        </p>
                    ) : (
                        <div>
                            {comments.map((com) => (
                                <CommentsLayout key={com.id} com={com} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostLayout;
