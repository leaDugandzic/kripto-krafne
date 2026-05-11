import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import donutImage from '../assets/img/images/puzzleImgTry.jpg';
import QR from '../assets/img/images/QRkodZaImages.png';

const DonutChallengeComponent = () => {
    const [pieces, setPieces] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const gridSize = 3;
    const pieceSize = 200;

    useEffect(() => {
        resetPuzzle();
    }, []);

    useEffect(() => {
        if (timerStarted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            alert("Vrijeme je isteklo! Pokušajte ponovo.");
            resetPuzzle();
        }
    }, [timerStarted, timeLeft]);

    const resetPuzzle = () => {
        const tempPieces = [];
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                tempPieces.push({ x, y, index: y * gridSize + x });
            }
        }
        setPieces(shuffle(tempPieces));
        setCompleted(false);
        setTimeLeft(30);
        setTimerStarted(false);
    };

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const checkCompletion = (updatedPieces) => {
        const isComplete = updatedPieces.every((piece, index) => piece.index === index);
        if (isComplete) {
            setCompleted(true);
            setTimerStarted(false);
        }
    };

    const handlePieceClick = (index) => {
        if (!timerStarted) setTimerStarted(true);
        if (selectedPiece === null) {
            setSelectedPiece(index);
        } else {
            setPieces(prevPieces => {
                const tempPieces = [...prevPieces];
                [tempPieces[index], tempPieces[selectedPiece]] = [tempPieces[selectedPiece], tempPieces[index]];
                setSelectedPiece(null);
                checkCompletion(tempPieces);
                return tempPieces;
            });
        }
    };

    const mins = Math.floor(timeLeft / 60);
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    const isLow = timeLeft <= 10;

    return (
        <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 8
                }}>
                    🍩 Slatki Izazov!
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Složite slagalicu u što kraćem vremenu!
                </p>
            </div>

            {/* Timer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 32px',
                borderRadius: 'var(--radius-full)',
                background: isLow ? 'rgba(255,74,110,0.12)' : 'var(--glass-bg)',
                border: `1px solid ${isLow ? 'var(--error)' : 'var(--glass-border)'}`,
                backdropFilter: 'var(--blur-sm)',
                transition: 'all 0.3s ease'
            }}>
                <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: isLow ? 'var(--error)' : 'var(--accent)',
                    animation: isLow ? 'pulse 1s ease-in-out infinite' : 'none'
                }}>
                    {mins}:{secs}
                </span>
                <button
                    onClick={resetPuzzle}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 4,
                        borderRadius: 'var(--radius-sm)',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Reset"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Puzzle grid */}
            <div className="glass-card" style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                    {pieces.map((piece, index) => (
                        <motion.div
                            key={index}
                            style={{
                                width: `${pieceSize}px`,
                                height: `${pieceSize}px`,
                                backgroundImage: `url(${donutImage})`,
                                backgroundSize: `${pieceSize * gridSize}px ${pieceSize * gridSize}px`,
                                backgroundPosition: `-${piece.x * pieceSize}px -${piece.y * pieceSize}px`,
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)',
                                border: selectedPiece === index
                                    ? '3px solid var(--accent)'
                                    : '3px solid transparent',
                                boxShadow: selectedPiece === index
                                    ? '0 0 16px var(--accent-glow)'
                                    : 'none',
                                transition: 'border-color 0.15s, box-shadow 0.15s'
                            }}
                            onClick={() => handlePieceClick(index)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                    ))}
                </div>
            </div>

            {/* Completion popup */}
            {completed && (
                <motion.div
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="glass-card"
                        style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 400, width: '90%', position: 'relative' }}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 150 }}
                    >
                        <button
                            onClick={() => setCompleted(false)}
                            style={{
                                position: 'absolute', top: 16, right: 16,
                                background: 'transparent', border: 'none',
                                cursor: 'pointer', color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 'var(--radius-sm)', padding: 4
                            }}
                        >
                            <X size={20} />
                        </button>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 16
                        }}>
                            🎉 Bravo! 🎉
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                            Skenirajte svojim očima da uhvatite nagradu.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={QR} style={{ display: 'none' }} alt="QR" />
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default DonutChallengeComponent;
