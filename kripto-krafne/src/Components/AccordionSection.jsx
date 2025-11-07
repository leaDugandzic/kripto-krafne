import React, { useEffect, useState } from "react";
import Accordion from "./Accordion";
import useData from "./useData";
import { useParams } from "react-router-dom";

const AccordionSection = () => {
  const { id } = useParams();
  const { getLevelById } = useData();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const lvl = await getLevelById(id);
        if (mounted) setLevel(lvl);
      } catch (err) {
        console.error("Error loading level in AccordionSection:", err);
        if (mounted) setLevel(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, getLevelById]);

  if (loading) {
    return <p className="text-pink-600 p-4 text-center">Učitavanje zanimljivosti...</p>;
  }

  if (!level || !level.fun_facts || level.fun_facts.length === 0) {
    return <p className="text-red-500 p-4 rounded-lg max-w-6xl mx-auto">Nema podataka za ovaj level.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 pb-3 border-b-2 border-dashed border-pink-400 title-font">
        Zanimljivosti
      </h2>
      <div className="space-y-3 w-full">
        {level.fun_facts.map((fact, index) => (
          <Accordion key={index} title={fact.question} content={fact.answer} />
        ))}
      </div>
    </div>
  );
};

export default AccordionSection;
