import { useState, useEffect } from "react";
import Donuts from "../assets/img/donuts.png";
import Donut from "../assets/img/donut.png";
import "../App.css";
import { Link } from "react-router-dom";

const Obavijest = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(true);

  }, []);

  return (
    <div className={`w-[70%] mt-[100px] relative mb-[150px] ${showPopup ? 'popup-show' : 'popup-hide'}`}>
      <div className="flex flex-col gap-2 bg-pink-300 p-10 border-1 border-pink-300 rounded-lg ">
        <img
          src={Donuts}
          className="h-[150px] absolute z-10 top-0 right-0 transform translate-x-1/2 translate-y-[-30%]"
          alt="Donuts"
        />
        <h1 className="text-pink-500 font-extrabold text-3xl ">Obavijest!</h1>
        <h4 className="text-pink-500 text-xl mb-[20px]">
          Natjecanje Kripto Krafne je započelo. Testiraj svoje znanje, predstavljaj svoju školu i postani dio jedne nezaboravne priče. Mladi hakeri pripreme su završile. Imate li ono što je potrebno da razotkrijete sve Kripto Krafne i osvojite nagradu! Kliknite na krafnu da saznate više!
        </h4>
      </div>
      <Link to="/">
        <img
          src={Donut}
          alt="Donut"
          className="h-[150px] absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 z-10 rotate-animation"
        />
      </Link>
    </div>
  );
};

export default Obavijest;
