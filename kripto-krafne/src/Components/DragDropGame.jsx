import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "./DraggableItem";
import DroppableBox from "./DroppableBox";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Krafna from "../assets/img/krafna.png";

const DragDropGame = ({ gameData, currentLevelId, onComplete }) => {
    const [items, setItems] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [matchedItems, setMatchedItems] = useState([]);
    const [showBravo, setShowBravo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (gameData) {
            setItems(gameData);
            setBoxes(gameData.map(item => ({
                id: item.id,
                text: item.description,
                matched: false
            })));
        }
    }, [gameData]);

    useEffect(() => {
        if (items.length > 0 && matchedItems.length === items.length) {
            onComplete?.();
            setTimeout(() => setShowBravo(true), 400);
        }
    }, [matchedItems, items.length]);

    const handleDrop = (item, box) => {
        if (item.description === box.text) {
            setMatchedItems(prev => [...prev, item.id]);
            setBoxes(prev => prev.map(b => b.id === box.id ? { ...b, matched: true } : b));
        }
    };

    const progress = items.length > 0 ? (matchedItems.length / items.length) * 100 : 0;

    return (
        <DndProvider backend={HTML5Backend}>
            <section style={{ maxWidth: 1200, margin: '0 auto 64px', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: 8
                    }}>
                        Povuci pojmove do ispravnih tvrdnji
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Spoji svaki pojam s odgovarajućom definicijom
                    </p>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Napredak</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700 }}>
                            {matchedItems.length} / {items.length}
                        </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--glass-border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                            borderRadius: 3,
                            transition: 'width 0.4s ease'
                        }} />
                    </div>
                </div>

                {/* Game area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
                    {/* Draggable items panel */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
                            paddingBottom: 16, borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--accent)'
                            }} />
                            <h3 style={{
                                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: 'var(--text-muted)'
                            }}>
                                Pojmovi
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 }}>
                            {items.map(item => !matchedItems.includes(item.id) && (
                                <DraggableItem key={item.id} item={item} />
                            ))}
                            {matchedItems.length === items.length && items.length > 0 && (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem', padding: '20px 0' }}>
                                    Svi pojmovi su spojeni! 🎉
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Droppable boxes panel */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
                            paddingBottom: 16, borderBottom: '1px solid var(--glass-border)'
                        }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--purple)'
                            }} />
                            <h3 style={{
                                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: 'var(--text-muted)'
                            }}>
                                Tvrdnje
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 200 }}>
                            {boxes.map(box => (
                                <DroppableBox key={box.id} box={box} onDrop={handleDrop} isMatched={box.matched} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

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
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
                            Sve si spojio točno!<br />
                            Nastavi dalje!
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
                @media (max-width: 640px) {
                    .dd-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </DndProvider>
    );
};

export default DragDropGame;
