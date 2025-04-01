import React from 'react';
import { useParams } from 'react-router-dom';
import useData from './useData';
import AccordionSection from './AccordionSection';
import DetailsSection from './DetailsSection';
import DragDropGame from './DragDropGame';

const Level = () => {
    const { id } = useParams(); // Get the ID from URL
    const { getLevelById } = useData();

    const level = getLevelById(id); // Retrieve the level data using the provided ID
    if (!level) return <p>Level nije pronađen</p>;

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4; // Check if this is the last level

    return (
        <div>
            <DetailsSection level={level} />
            <AccordionSection funFacts={level.fun_facts} />
            <DragDropGame gameData={level.game} currentLevelId={level.id} />
        </div>
    );
};

export default Level;
