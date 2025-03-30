import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    const images = import.meta.glob('/src/assets/img/kutije/*.png', { eager: true });
    const imageArray = Object.values(images).map((img) => img.default);
    return (
        <div className="w-250 mx-auto mt-10 pb-4 flex flex-wrap justify-center gap-7 boxes-container">
            {imageArray.map((src, index) => {
                const base = index + 1;
                const adjustedIndex = base * 100 + 1;
                return (
                    <Link key={adjustedIndex} to={`/box/${adjustedIndex}`}>
                        <img src={src} alt={`Krafna ${adjustedIndex}`} className="w-70 h-70 box-image" />
                    </Link>
                );
            })}
        </div>

    )
}

export default Home
