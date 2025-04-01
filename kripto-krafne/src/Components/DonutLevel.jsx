import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Krafna from "../assets/img/krafna.png";

const DonutLevel = () => {
    const { id } = useParams(); // Get current level ID from the URL
    const navigate = useNavigate();

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4; // Check if this is the last level (104, 204, 304...)

    const handleNavigation = () => {
        // Navigate to the next level or home page
        navigate(isLastLevel ? "/" : `/box/${nextLevelId}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="bg-pink-300 p-8 rounded-2xl shadow-lg text-center w-100 text-pink-700">
                <div className="flex justify-center mb-4">
                    {/* First Donut */}
                    <img
                        src={Krafna}
                        alt="Donut"
                        className="w-20 h-20"
                    />

                    {id % 100 >= 2 ? (
                        <img
                            src={Krafna}
                            alt="Donut"
                            className="w-20 h-20 mx-2"
                        />
                    ) : (
                        <div className="w-20 h-20 border-2 border-dotted border-gray-500 rounded-full mx-2"></div>
                    )}

                    {id % 100 === 3 ? (
                        <img
                            src={Krafna}
                            alt="Donut"
                            className="w-20 h-20"
                        />
                    ) : (
                        <div className="w-20 h-20 border-2 border-dotted border-gray-500 rounded-full"></div>
                    )}
                </div>

                <p className="text-white font-semibold italic">
                    Bravo! Možeš li doći do svih <br /> Kripto Krafni?
                </p>
                <button
                    onClick={handleNavigation}
                    className="bg-pink-700 text-white px-4 py-2 rounded-md mt-4 hover:bg-pink-800"
                >
                    {isLastLevel ? "Povratak na početnu" : "Idući level >"}
                </button>
            </div>
        </div>
    );
};

export default DonutLevel;
