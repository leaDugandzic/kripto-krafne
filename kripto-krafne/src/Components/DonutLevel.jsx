import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Krafna from "../assets/img/krafna.png";

const DonutLevel = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4;

    const handleNavigation = () => {
        navigate(isLastLevel ? "/" : `/box/${nextLevelId}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-pink-300 p-8 rounded-3xl shadow-xl max-w-md w-full">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center items-center mb-6">
                        <div className={`relative ${id % 100 >= 1 ? "" : "opacity-50"}`}>
                            <img src={Krafna} alt="Donut" className="w-20 h-20" />
                            {id % 100 >= 1 && (
                                <div className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    1
                                </div>
                            )}
                        </div>

                        <div className="h-1 w-12 bg-pink-400 mx-1"></div>

                        <div className={`relative ${id % 100 >= 2 ? "" : "opacity-50"}`}>
                            {id % 100 >= 2 ? (
                                <img src={Krafna} alt="Donut" className="w-20 h-20" />
                            ) : (
                                <div className="w-20 h-20 border-2 border-dashed border-pink-500 rounded-full flex items-center justify-center text-pink-500">
                                    ?
                                </div>
                            )}
                            {id % 100 >= 2 && (
                                <div className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    2
                                </div>
                            )}
                        </div>

                        <div className="h-1 w-12 bg-pink-400 mx-1"></div>

                        <div className={`relative ${id % 100 >= 3 ? "" : "opacity-50"}`}>
                            {id % 100 >= 3 ? (
                                <img src={Krafna} alt="Donut" className="w-20 h-20" />
                            ) : (
                                <div className="w-20 h-20 border-2 border-dashed border-pink-500 rounded-full flex items-center justify-center text-pink-500">
                                    ?
                                </div>
                            )}
                            {id % 100 >= 3 && (
                                <div className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    3
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-pink-700 mb-2 title-font">Bravo!</h2>
                        <p className="text-white font-semibold text-lg">
                            Možeš li doći do svih<br />
                            <span className="text-pink-700 font-bold">Kripto Krafni</span>?
                        </p>
                    </div>

                    <button
                        onClick={handleNavigation}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        {isLastLevel ? "🏠 Početna" : `Level ${nextLevelId % 100} →`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonutLevel; 