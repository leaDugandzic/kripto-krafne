import Accordion from "./Accordion";

const AccordionSection = () => {
    return (
        <div className="bg-cream p-8 text-pink-700">
            <h2 className="text-xl font-bold italic text-center ">Zanimljivosti</h2>
            <div className="mt-4">
                <Accordion title="Pitanje 1" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..." />
                <Accordion title="Pitanje 2" content="Još jedan zanimljiv odgovor..." />
                <Accordion title="Pitanje 3" content="Više informacija ovdje..." />
            </div>
        </div>
    );
};

export default AccordionSection
