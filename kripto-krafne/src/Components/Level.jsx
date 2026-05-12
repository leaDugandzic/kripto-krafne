import { useState, useEffect } from 'react';
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
                setLevel(levelData);
            } catch (err) {
                console.error('Error loading level:', err);
            } finally {
                setLevelLoading(false);
            }
        };
        if (id) loadLevel();
    }, [id, getLevelById]);

    if (loading || levelLoading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%',
                        border: '3px solid var(--glass-border)',
                        borderTopColor: 'var(--accent)',
                        animation: 'rotateDonut 0.8s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Učitavanje lekcije…</p>
                </div>
            </div>
        );
    }

    if (error || !level) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="glass-card" style={{ padding: '32px', textAlign: 'center', maxWidth: 400 }}>
                    <p style={{ fontSize: '2rem', marginBottom: 8 }}>🍩</p>
                    <p style={{ color: 'var(--error)', fontWeight: 600 }}>
                        {error ? `Greška: ${error}` : 'Level nije pronađen'}
                    </p>
                </div>
            </div>
        );
    }

    const GameComponent = gameComponents[level.gameType] || DragDropGame;

    const handleLevelComplete = async () => {
        try {
            await fetch('http://localhost/kripto-krafne/kripto-krafne/src/backend/complete_level.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level_id: level.id }),
            });
        } catch {
            // non-critical — ignore silently
        }
    };

    return (
        <div className="page-wrapper">
            <DetailsSection level={level} />
            <AccordionSection />
            <GameComponent
                gameData={level.game}
                currentLevelId={level.id}
                vulnerabilities={level.vulnerabilities}
                onComplete={handleLevelComplete}
            />
        </div>
    );
};

export default Level;
