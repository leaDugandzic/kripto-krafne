import { useState } from "react";

const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-2">
            <button
                className="w-full bg-pink-400 text-white text-left px-4 py-2 rounded-lg flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <span>{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && <div className="p-4 bg-white text-gray-800 border rounded-lg">{content}</div>}
        </div>
    );
};

export default Accordion