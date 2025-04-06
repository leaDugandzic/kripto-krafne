import React from 'react';
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
    const { getLevelById } = useData();

    const level = getLevelById(id);
    if (!level) return <p>Level nije pronađen</p>;

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4;
    const GameComponent = gameComponents[level.gameType] || DragDropGame;

    return (
        <div>
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
