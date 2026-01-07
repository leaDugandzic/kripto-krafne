import { useState, useEffect } from "react";

const CommentsLayout = ({com}) => {  
    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-2">
         
            <article className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                        <span>Autor: {com.user_id}</span>
                        <span>•</span>
                        <span>{com.publish_date}</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                            <p  className="mb-4">{com.content}</p>
                    </div>
                </div>

            </article>

   
        </div>
    );
};

export default CommentsLayout;