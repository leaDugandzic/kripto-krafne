import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Krafna from "../assets/img/krafna.png";

const MemoryCardGame = ({ gameData, currentLevelId, onComplete }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [showBravo, setShowBravo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cardPairs = gameData.flatMap(item => [
            { id: item.id, type: 'term', content: item.term, pairId: `${item.id}-term`, matchId: `${item.id}-def` },
            { id: item.id, type: 'definition', content: item.description, pairId: `${item.id}-def`, matchId: `${item.id}-term` }
        ]);
        setCards(cardPairs.map((card, i) => ({ ...card, uniqueId: i })).sort(() => Math.random() - 0.5));
    }, [gameData]);

    useEffect(() => {
        if (matched.length === gameData.length * 2 && gameData.length > 0) {
            onComplete?.();
            setTimeout(() => setShowBravo(true), 600);
        }
    }, [matched, gameData.length]);

    const handleCardClick = (id) => {
        if (flipped.includes(id) || matched.includes(id) || flipped.length >= 2) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);
        setMoves(m => m + 1);

        if (newFlipped.length === 2) {
            const first = cards.find(c => c.uniqueId === newFlipped[0]);
            const second = cards.find(c => c.uniqueId === newFlipped[1]);
            if (first.matchId === second.pairId) {
                setMatched(prev => [...prev, first.uniqueId, second.uniqueId]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const matchedPairs = matched.length / 2;
    const totalPairs = gameData.length;

    return (
        <section style={{ maxWidth: 1200, margin: '0 auto 64px', padding: '0 24px' }}>
            {/* Header */}
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 8
                }}>
                    Spoji Memori Kartice
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Pronađi sve parove pojmova i definicija
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
                <div className="glass-card" style={{ padding: '12px 24px', textAlign: 'center', minWidth: 120 }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 2 }}>{moves}</p>
                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Potezi</p>
                </div>
                <div className="glass-card" style={{ padding: '12px 24px', textAlign: 'center', minWidth: 120 }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple)', marginBottom: 2 }}>{matchedPairs}/{totalPairs}</p>
                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>Parovi</p>
                </div>
            </div>

            {/* Card grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16
            }}>
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.uniqueId);
                    const isMatched = matched.includes(card.uniqueId);
                    const revealed = isFlipped || isMatched;
                    const isTerm = card.type === 'term';

                    return (
                        <div
                            key={card.uniqueId}
                            onClick={() => handleCardClick(card.uniqueId)}
                            style={{
                                height: 140,
                                cursor: isMatched ? 'default' : 'pointer',
                                perspective: 800,
                                userSelect: 'none'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                transformStyle: 'preserve-3d',
                                transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                transition: 'transform 0.4s ease'
                            }}>
                                {/* Back face (hidden) */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backfaceVisibility: 'hidden',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '2rem', fontWeight: 800 }}>?</span>
                                </div>

                                {/* Front face (content) */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    borderRadius: 'var(--radius-md)',
                                    background: isMatched ? 'rgba(100,220,150,0.12)' : 'var(--bg-surface)',
                                    border: `1px solid ${isMatched ? 'var(--success)' : 'var(--glass-border)'}`,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    padding: 12,
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <p style={{
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        color: isMatched ? 'var(--success)' : 'var(--text-primary)',
                                        textAlign: 'center',
                                        lineHeight: 1.4,
                                        marginBottom: 8
                                    }}>
                                        {card.content}
                                    </p>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: isTerm ? 'var(--accent)' : 'var(--purple)'
                                    }}>
                                        {isTerm ? 'Pojam' : 'Definicija'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bravo popup */}
            {showBravo && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="glass-card" style={{
                        padding: '48px 40px',
                        textAlign: 'center',
                        maxWidth: 420,
                        width: '90%',
                        animation: 'fadeInUp 0.4s ease'
                    }}>
                        <img
                            src={Krafna}
                            alt="Krafna"
                            style={{
                                width: 80, height: 80,
                                margin: '0 auto 20px',
                                animation: 'rotateDonut 3s linear infinite'
                            }}
                        />
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2.4rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 8
                        }}>
                            Bravo!
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
                            Spojio/la si sve kartice!
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 32 }}>
                            {moves} poteza
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/donut-level/${currentLevelId}`)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px' }}
                        >
                            Nastavi <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </section>
    );
};

export default MemoryCardGame;
