import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    const images = import.meta.glob('/src/assets/img/kutije/*.png', { eager: true });
    const imageArray = Object.values(images).map((img) => img.default);
    return (
        <div className="w-250 mx-auto mt-15 flex flex-wrap justify-center gap-7 boxes-container">
            {imageArray.map((src, index) => (
                <Link to={`/box/${index}/level/1`}>
                    <img key={index} src={src} alt={`Krafna ${index}`} className="w-70 h-70 box-image" />
                </Link>
            ))}
        </div>

    )
}

export default Home
