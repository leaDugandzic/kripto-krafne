import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#ffface] p-20 relative">
            <h1 className="mb-8 text-[#ff10a2] title text-7xl animate-bounce">🍩 Slatki Izazov! 🍩</h1>
            <p className="text-3xl text-[#ff10a2] mb-10">Pokušajte složiti slagalicu u što kraćem vremenu!</p>
            <h2 className="text-4xl mb-8 text-[#ff10a2] animate-pulse">
                Vrijeme: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </h2>
            <div className="puzzle-container bg-[#fda5d5] p-12 rounded-lg shadow-2xl relative">
                <div className="grid grid-cols-3 gap-3">
                    {pieces.map((piece, index) => (
                        <motion.div
                            key={index}
                            className={`puzzle-piece ${selectedPiece === index ? 'border-4 border-[#ff10a2]' : ''}`}
                            style={{
                                width: `${pieceSize}px`,
                                height: `${pieceSize}px`,
                                backgroundImage: `url(${donutImage})`,
                                backgroundSize: `${pieceSize * gridSize}px ${pieceSize * gridSize}px`,
                                backgroundPosition: `-${piece.x * pieceSize}px -${piece.y * pieceSize}px`,
                                cursor: 'pointer',
                                borderRadius: '0.5rem',
                            }}
                            onClick={() => handlePieceClick(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                    ))}
                </div>
            </div>

            {completed && (
                <motion.div
                    className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white p-8 rounded-lg shadow-lg text-center mt-6 w-96 border border-[#ff10a2]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                >
                    <button
                        className="absolute top-3 right-3 text-[#ff10a2] text-3xl font-bold cursor-pointer"
                        onClick={() => setCompleted(false)}
                    >
                        ✖
                    </button>
                    <h2 className="text-3xl font-bold mb-6 text-[#ff10a2] animate-bounce">🎉 Bravo! 🎉</h2>
                    <p className="mb-6 text-[#fda5d5] text-xl">"Skenirajte svojim očima da uhvatite nagradu."</p>
                    <div className="flex justify-center">
                        <img src={QR} style={{ display: 'none' }} className="mx-auto" />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DonutChallengeComponent;
