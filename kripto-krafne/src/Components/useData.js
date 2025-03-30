import { useState, useEffect } from 'react';
import levelsData from '../library/levels.json';

const useData = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Pretpostavljam da tvoj JSON ima ključ "categories"
            setCategories(levelsData.categories);
            setLoading(false);
        } catch (error) {
            setError("Failed to load data.");
            setLoading(false);
        }
    }, []);

    const getCategoryById = (id) => {
        if (!categories || !Array.isArray(categories)) {
            console.error("categories nije učitan ili nije array");
            return null;
        }
        // Pazite da pretvoriš tip ako id dolazi kao string (npr. iz useParams)
        return categories.find(category => category.id === Number(id));
    };

    const getLevelById = (id) => {
        // Pregledaj sve kategorije i traži level s odgovarajućim id-om
        for (const category of categories) {
            const levelFound = category.levels.find(level => level.id === Number(id));
            if (levelFound) {
                return levelFound;
            }
        }
        return null;
    };

    return { categories, loading, error, getCategoryById, getLevelById };
};

export default useData;
