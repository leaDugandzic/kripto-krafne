import { useState } from "react";

const Accordion = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-3 w-full">
            <button
                className={`w-full text-left px-5 py-3 rounded-lg flex justify-between items-center
        transition-all duration-200 ${isOpen ?
                        'bg-pink-400 text-white' :
                        'bg-pink-300 text-white hover:bg-pink-400 active:bg-pink-500 focus:bg-pink-300'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{title}</span>
                <span className="text-sm ml-2">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
                <div className="px-5 py-3 mt-1 bg-pink-100 text-gray-700 rounded-b-lg border border-t-0 border-pink-300">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Accordion;