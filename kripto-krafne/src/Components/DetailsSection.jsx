import React from "react";

const DetailsSection = ({ level }) => {
    return (
        <div className="p-8 flex flex-col lg:flex-row gap-8 text-pink-700">
            <div className="lg:w-2/3">
                <h2 className="text-xl font-bold italic">{level.name}</h2>
                <p className="mt-4">{level.lesson}</p>
            </div>
            <div className="lg:w-1/3">
                <iframe className="w-full h-70 rounded-lg" src={level.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </div>
    );
};

export default DetailsSection;
