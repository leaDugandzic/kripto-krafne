import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useData from './useData';
import AccordionSection from './AccordionSection';
import DetailsSection from './DetailsSection';
import DragDropGame from './DragDropGame';
import FindVulnerabilityGame from './FindVulnerabilityGame';
import MemoryCardGame from './MemoryCard';

const gameComponents = {
    dragDrop: DragDropGame,
    findVulnerability: FindVulnerabilityGame,
    memoryCards: MemoryCardGame
};

const Level = () => {
    const { id } = useParams();
    const { getLevelById, loading, error } = useData();
    const [level, setLevel] = useState(null);
    const [levelLoading, setLevelLoading] = useState(true);

    useEffect(() => {
        const loadLevel = async () => {
            setLevelLoading(true);
            try {
                const levelData = await getLevelById(id);
                console.log(levelData)
                setLevel(levelData);
            } catch (err) {
                console.error('Error loading level:', err);
            } finally {
                setLevelLoading(false);
            }
        };
        
        if (id) {
            loadLevel();
        }
    }, [id, getLevelById]);
    // console.log(level.fun_facts)
    // Prikaži loading dok se podaci učitavaju
    if (loading || levelLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-pink-600 text-xl">Učitavanje...</div>
            </div>
        );
    }

    // Prikaži grešku ako postoji
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-xl">Greška: {error}</div>
            </div>
        );
    }

    // Ako level nije pronađen
    if (!level) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-xl">Level nije pronađen</div>
            </div>
        );
    }

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4;
    const GameComponent = gameComponents[level.gameType] || DragDropGame;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <DetailsSection level={level} />
            <AccordionSection funFacts={level.fun_facts} />
            <GameComponent
                gameData={level.game}
                currentLevelId={level.id}
                vulnerabilities={level.vulnerabilities}
            />
        </div>
    );
};

export default Level;