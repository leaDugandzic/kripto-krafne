import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MemoryCardGame = ({ gameData, currentLevelId }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const cardPairs = gameData.map(item => ({
            id: item.id,
            term: item.term,
            definition: item.description,
            matched: false
        }));

        const shuffledCards = [...cardPairs, ...cardPairs]
            .map((card, i) => ({ ...card, uniqueId: i }))
            .sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
    }, [gameData]);

    const handleCardClick = (id) => {
        if (flipped.length >= 2 || flipped.includes(id) || matched.includes(cards.find(c => c.uniqueId === id).id)) {
            return;
        }

        setFlipped([...flipped, id]);
        setMoves(moves + 1);

        if (flipped.length === 1) {
            const firstCard = cards.find(c => c.uniqueId === flipped[0]);
            const secondCard = cards.find(c => c.uniqueId === id);

            if (firstCard.id === secondCard.id) {
                setMatched([...matched, firstCard.id]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="p-6 bg-beige-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Memory Cards Game</h2>
            <p className="text-pink-600 mb-4">Pokušaja: {moves} | Pronađeno parova: {matched.length}/{gameData.length}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {cards.map(card => (
                    <div
                        key={card.uniqueId}
                        onClick={() => handleCardClick(card.uniqueId)}
                        className={`card h-32 cursor-pointer transition-all duration-300 ${flipped.includes(card.uniqueId) || matched.includes(card.id) ? 'bg-purple-400' : 'bg-purple-100'}`}
                    >
                        <div className={`card-body flex items-center justify-center p-2 ${flipped.includes(card.uniqueId) || matched.includes(card.id) ? '' : 'backface-hidden'}`}>
                            {flipped.includes(card.uniqueId) || matched.includes(card.id) ? (
                                <p className="text-center font-medium">
                                    {card.term === cards.find(c => c.uniqueId === flipped[0])?.term ? card.definition : card.term}
                                </p>
                            ) : (
                                <p className="text-center text-purple-700 font-bold">?</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {/* 🎉 Bravo! Riješili ste igru u {moves} pokušaja! */}
            {matched.length === gameData.length && (
                navigate(`/donut-level/${currentLevelId}`)
            )}
        </div>
    );
};

export default MemoryCardGame;