import { useState, useEffect } from 'react';
import levelsData from '../library/levels.json';

const useData = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            setCategories(levelsData.categories);
            console.log("Učitane kategorije:", levelsData.categories);
            setLoading(false);
        } catch (error) {
            setError("Failed to load data.");
            console.error("Greška pri učitavanju podataka:", error);
            setLoading(false);
        }
    }, []);

    const getCategoryById = (id) => {
        if (!categories || !Array.isArray(categories)) {
            console.error("categories nije učitan ili nije array");
            return null;
        }
        const category = categories.find(category => category.id === Number(id));
        console.log("Dohvaćena kategorija:", category);
        return category;
    };

    const getLevelById = (id) => {
        for (const category of categories) {
            const levelFound = category.levels.find(level => level.id === Number(id));
            if (levelFound) {
                console.log("Dohvaćen level:", levelFound);
                return levelFound;
            }
        }
        console.error("Level nije pronađen za id:", id);
        return null;
    };

    return { categories, loading, error, getCategoryById, getLevelById };
};

export default useData;
