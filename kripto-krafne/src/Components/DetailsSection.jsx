import React from "react";

const DetailsSection = ({ level }) => {
    return (
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start bg-white rounded-xl shadow-md max-w-6xl mx-auto my-8 border border-gray-100">
        
            <div className="lg:w-1/2 space-y-4">
                <h2 className="text-2xl font-bold text-pink-700 font-sans">
                    {level.name}
                </h2>
                <div className="h-1 w-16 bg-pink-300 my-2"></div> 
                <p className="text-gray-700 leading-relaxed">
                    {level.lesson}
                </p>
                
                {level.additionalInfo && (
                    <div className="bg-pink-50 p-4 rounded-lg mt-4">
                        <h3 className="font-medium text-pink-600 mb-2 text-sm uppercase tracking-wider">Key Points</h3>
                        <p className="text-pink-700 text-sm">{level.additionalInfo}</p>
                    </div>
                )}
            </div>

          
            <div className="lg:w-1/2 w-full self-stretch">
                <div className="relative h-full min-h-[300px] rounded-lg overflow-hidden shadow-lg bg-gray-100 border border-gray-200">
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={level.video} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                    ></iframe>
                </div>
                {level.videoCaption && (
                    <p className="text-center text-gray-500 text-xs mt-2">
                        {level.videoCaption}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DetailsSection;