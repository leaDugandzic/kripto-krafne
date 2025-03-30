import Accordion from "./Accordion";
import useData from "./useData";
import { useParams } from "react-router-dom";

const AccordionSection = () => {
    const { id } = useParams();
    const { getLevelById } = useData();
    const level = getLevelById(id);

    if (!level || !level.fun_facts) {
        return <p className="text-red-500">Nema podataka za ovaj level.</p>;
    }

    return (
        <div>
            <h2>Zanimljivosti</h2>
            {level.fun_facts.map((fact, index) => (
                <Accordion key={index} title={fact.question} content={fact.answer} />
            ))}
        </div>
    );
};


export default AccordionSection;
