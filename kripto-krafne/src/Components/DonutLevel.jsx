import React from "react";
import Krafna from "../assets/img/krafna.png"

const DonutLevel = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="bg-pink-300 p-8 rounded-2xl shadow-lg text-center w-100">
                <div className="flex justify-center mb-4">
                    <img
                        src={Krafna}
                        alt="Donut"
                        className="w-20 h-20"
                    />
                    <div className="w-20 h-20 border-2 border-dotted border-gray-500 rounded-full mx-2"></div>
                    <div className="w-20 h-20 border-2 border-dotted border-gray-500 rounded-full"></div>
                </div>
                <p className="text-white font-semibold italic">
                    Bravo! Osvojio si svoju prvu <br /> Kripto Krafnu.
                </p>
                <a href="#" className="text-gray-900 font-semibold mt-4 block hover:underline">
                    Idući level &gt;
                </a>
            </div>
        </div>
    );
};

export default DonutLevel;
