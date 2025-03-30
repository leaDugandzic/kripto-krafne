import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useData from './useData';
import AccordionSection from './AccordionSection';
import DetailsSection from './DetailsSection';

const Level = () => {
    const { id } = useParams(); // Dohvati ID iz URL-a
    const { getLevelById } = useData();
    const navigate = useNavigate();

    const level = getLevelById(id);
    if (!level) return <p>Level nije pronađen</p>;

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4; // Ako je id 104, 204, 304...

    return (
        <div>
            <DetailsSection level={level} />
            <AccordionSection funFacts={level.fun_facts} />

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => navigate(isLastLevel ? '/' : `/box/${nextLevelId}`)}
                    className="bg-pink-700 text-white px-4 py-2 rounded-md"
                >
                    {isLastLevel ? "Povratak na početnu" : "Sljedeći level"}
                </button>
            </div>
        </div>
    );
};

export default Level;
