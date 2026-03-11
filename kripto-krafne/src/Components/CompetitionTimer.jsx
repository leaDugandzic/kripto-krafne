import { useState, useEffect } from 'react';

const CompetitionTimer = () => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        checkCompetitionStatus();
        const interval = setInterval(checkCompetitionStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const checkCompetitionStatus = async () => {
        try {
            const response = await fetch('http://localhost/backend/competition_status.php', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success && data.is_active) {
                setIsActive(true);
                setTimeLeft(data.time_remaining);
            } else {
                setIsActive(false);
            }
        } catch (error) {
            console.error('Error checking competition:', error);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || seconds < 0) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isActive) return null;

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="font-mono font-bold text-lg">
                    {formatTime(timeLeft)}
                </div>
                <span className="text-sm font-semibold">LEFT</span>
            </div>
        </div>
    );
};

export default CompetitionTimer;