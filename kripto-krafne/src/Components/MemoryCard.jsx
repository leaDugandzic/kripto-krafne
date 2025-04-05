import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MemoryCardGame = ({ gameData, currentLevelId }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const cardPairs = gameData.flatMap(item => [
            { 
                id: item.id,
                type: 'term',
                content: item.term,
                pairId: `${item.id}-term`,
                matchId: `${item.id}-def`
            },
            { 
                id: item.id,
                type: 'definition',
                content: item.description,
                pairId: `${item.id}-def`,
                matchId: `${item.id}-term`
            }
        ]);

        const shuffledCards = cardPairs
            .map((card, i) => ({ ...card, uniqueId: i }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
    }, [gameData]);

    useEffect(() => {
        if (matched.length === gameData.length * 2 && gameData.length > 0) {
            setTimeout(() => navigate(`/donut-level/${currentLevelId}`), 1500);
        }
    }, [matched]);

    const handleCardClick = (id) => {
        // Don't allow click if card is already flipped or matched
        if (flipped.includes(id) || matched.includes(id) || flipped.length >= 2) {
            return;
        }

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);
        setMoves(moves + 1);

        // Check for match when two cards are flipped
        if (newFlipped.length === 2) {
            const firstCard = cards.find(c => c.uniqueId === newFlipped[0]);
            const secondCard = cards.find(c => c.uniqueId === newFlipped[1]);

            if (firstCard.matchId === secondCard.pairId) {
                setMatched([...matched, firstCard.uniqueId, secondCard.uniqueId]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 text-center">
                Memory Card Challenge
                <div className="w-32 h-1.5 bg-purple-500 mx-auto mt-3 rounded-full"></div>
            </h2>

            <div className="flex justify-center gap-8 mb-6">
                <div className="bg-pink-100 px-4 py-2 rounded-lg border-2 border-pink-300">
                    <span className="font-bold text-pink-700">Moves: </span>
                    <span className="text-pink-600 font-bold">{moves}</span>
                </div>
                <div className="bg-purple-100 px-4 py-2 rounded-lg border-2 border-purple-300">
                    <span className="font-bold text-purple-700">Matched: </span>
                    <span className="text-purple-600 font-bold">{matched.length / 2}/{gameData.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.uniqueId);
                    const isMatched = matched.includes(card.uniqueId);
                    const isTerm = card.type === 'term';

                    return (
                        <div
                            key={card.uniqueId}
                            onClick={() => handleCardClick(card.uniqueId)}
                            className={`h-32 cursor-pointer rounded-xl shadow-lg transition-all duration-300 relative ${
                                isMatched ? 'border-green-500' : 'border-white'
                            } border-2`}
                        >
                            {/* Card Front (Gradient Back) */}
                            <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                                !isFlipped && !isMatched ? 'opacity-100' : 'opacity-0'
                            } transition-opacity duration-300 bg-gradient-to-br from-pink-400 to-purple-400`}>
                                <p className="text-white text-4xl font-bold">?</p>
                            </div>
                            
                            {/* Card Back (Content) */}
                            <div className={`absolute inset-0 flex items-center justify-center p-4 rounded-xl ${
                                isFlipped || isMatched ? 'opacity-100 bg-white' : 'opacity-0'
                            } transition-opacity duration-300`}>
                                <div className="text-center">
                                    <p className="font-bold text-gray-800 mb-1">{card.content}</p>
                                    {isMatched && (
                                        <span className="text-green-500 text-2xl">✓</span>
                                    )}
                                    {isTerm ? (
                                        <span className="text-xs text-pink-500">POJAM</span>
                                    ) : (
                                        <span className="text-xs text-purple-500">DEFINICIJA</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {matched.length === gameData.length * 2 && gameData.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl text-center animate-bounce">
                    <p className="text-white font-bold text-xl uppercase">
                        🎉 Bravo! Completed in {moves} moves!
                    </p>
                </div>
            )}
        </div>
    );
};

export default MemoryCardGame;