import React from "react";

const DetailsSection = ({ level }) => {
    return (
        <div className="bg-cream p-8 flex flex-col lg:flex-row gap-8 text-pink-700">
            <div className="lg:w-2/3">
                <h2 className="text-xl font-bold italic">{level.name}</h2>
                <p className="mt-4">{level.lesson}</p>
            </div>
            <div className="lg:w-1/3">
                <iframe
                    className="w-full h-48 rounded-lg"
                    src={level.video}
                    title="Video Player"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default DetailsSection;
