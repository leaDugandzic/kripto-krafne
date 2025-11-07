
import { useState, useEffect, useCallback } from 'react';
import jsonData from '../library/levels.json'; 

const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost/kripto-krafne/kripto-krafne/src/backend';

  const fetchSQLData = async (levelId) => {
    try {
      const res = await fetch(`${API_BASE}/level.php?id=${levelId}`);
      if (!res.ok) throw new Error(`Network response not ok: ${res.status}`);
      const result = await res.json();
      if (!result.success) {
        console.warn('SQL API Warning:', result.message);
        return null;
      }
      return result.data;
    } catch (err) {
      console.error('SQL API Error:', err);
      return null;
    }
  };

  const getLevelFromJSON = useCallback((id) => {
    return jsonData.categories
      .map(category => category.levels).flat()
      .find(level => level.id === parseInt(id, 10)) || null;
  }, []);

  const getLevelById = useCallback(async (id) => {
    if (!id) return null;
    const jsonLevel = getLevelFromJSON(id);
    if (!jsonLevel) return null;

    const sqlData = await fetchSQLData(id);
    if (sqlData) {
      return {
        ...jsonLevel,
        game: sqlData.game ?? jsonLevel.game,
        vulnerabilities: sqlData.vulnerabilities ?? {}
      };
    }
    return jsonLevel;
  }, [getLevelFromJSON]);

  useEffect(() => {
    setLoading(true);
    try {
      setData({
        categories: jsonData.categories,
        levels: jsonData.categories.map(c => c.levels).flat()

      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getLevelById,
    getCategories: () => jsonData.categories,
    getAllLevels: () => jsonData.categories.map(c => c.levels).flat()

  };
};

export default useData;
