import {useState, useEffect} from "react";

import jsonData from"../library/levels.json";

const useData=()=>{
    const[data,setData] = useState(null);
    const[loading, setLoading] = setData(true);

    const APi_BASE = "http://localhost/kripto-krafne/kripto-krafne/src/backend";

    const fetchSQLData = async(endpoint)=>{
        try{
            const response = await fetch(`${API_BASE}/${endpoint}`);
            const result = await response.json();
            try {
                    return result.data;
                } catch (e) {
                    console.error("Error", result.message);
                    throw new Error("API request failed");
                }
        }
        catch(e){
            console.error("SQL API ERROR: ", e);
            return null;
        }
    };

    const getGameDataFromSql = async(levelId)=>{

        return await fetchSQLData(`level.php?id=${levelId}`);
    }

    const getLevelById=(id)=>{
  const jsonLevel = jsonData.categories
        .flatMap(category=>category.levels)
        .find(level=>level.id===parseInt(id));

        return jsonLevel;
    }

    const getLevelWithGameData = async(id)=>{
        const jsonLeve= getLevelById(id);
        if(!jsonLevel) return null;

        const sqlData = await getGameDataFromSql(id);

          if (sqlData) {
            return {
                ...jsonLevel,
                game: sqlData.game,
                vulnerabilities: sqlData.vulnerabilities
            };
        }
        return jsonLevel;
    }
     useEffect(() => {
        setData({
            categories: jsonData.categories,
            levels: jsonData.categories.flatMap(category => category.levels)
        });
        setLoading(false);
    }, []);

    return {data, loading, getLevelById:getLevelWithGameData, getCategories: ()=>jsonData.categories, getAllLevels:()=>jsonData.categories.flatMap(category=> category.levels)}
}

export default Data;
