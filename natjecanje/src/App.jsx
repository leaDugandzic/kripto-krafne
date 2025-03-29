import { useState } from "react";
import { motion } from "framer-motion";

const donuts = [
  { id: 1, src: "../src/img/yellow-donut.webp", code: "1", position: { top: "70%", left: "5%" } },
  { id: 2, src: "../src/img/brown-drizzle-donut.webp", code: "5", position: { top: "60%", left: "50%" } },
  { id: 3, src: "../src/img/white-dotted-donut.webp", code: "6", position: { top: "70%", left: "80%" } },
  { id: 4, src: "../src/img/blue-donut.webp", code: "4", position: { top: "25%", left: "80%" } },
  { id: 5, src: "../src/img/plain-donut.webp", code: "3", position: { top: "10%", left: "45%" } },
  { id: 6, src: "../src/img/green-donut.webp", code: "2", position: { top: "30%", left: "20%" } },
];

const lines = [
  { id: "1and5", src: "../src/img/1and5.png", position: { top: "60%", left: "5%" }, rotation: 0 },
  { id: "two", src: "../src/img/two.png", position: { top: "50%", left: "70%" }, rotation: 0 },
  { id: "three", src: "../src/img/three.png", position: { top: "32%", left: "65%" }, rotation: 0 },
  { id: "four", src: "../src/img/four.png", position: { top: "30%", left: "30%" }, rotation: 0 },
  { id: "1and5-upside-down", src: "../src/img/1and5.png", position: { top: "55%", left: "22%" }, rotation: 180 },
  { id: "six", src: "../src/img/six.png", position: { top: "80%", left: "40%" }, rotation: 0 }
];

const castlePosition = { top: "5%", left: "5%" };

export default function DonutGame() {
  const [inputs, setInputs] = useState(Array(6).fill(""));
  const [validated, setValidated] = useState(Array(6).fill(false));
  const [shake, setShake] = useState(Array(6).fill(false));

  const handleValidation = (index) => {
    if (inputs[index] === donuts[index].code) {
      const newValidated = [...validated];
      newValidated[index] = true;
      setValidated(newValidated);
    } else {
      setShake((prev) => {
        const newShake = [...prev];
        newShake[index] = true;
        return newShake;
      });
      setTimeout(() => {
        setShake((prev) => {
          const newShake = [...prev];
          newShake[index] = false;
          return newShake;
        });
      }, 500);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#ffceea]">
      <img src="../src/img/castle.png" alt="Castle" className="absolute" style={{ top: castlePosition.top, left: castlePosition.left, width: '200px' }} />
      {lines.map(line => (
        <img key={line.id} src={line.src} alt={line.id} className="absolute" style={{ top: line.position.top, left: line.position.left, width: '500px', transform: `rotate(${line.rotation}deg)` }} />
      ))}
      {donuts.map((donut, index) => (
        <div key={donut.id} className="absolute flex flex-col items-center" style={{ top: donut.position.top, left: donut.position.left }}>
          <motion.img src={donut.src} alt="Donut" className="w-55 h-55" animate={validated[index] ? { rotate: 360 } : {}} transition={{ duration: 1 }} />
          <div className="flex items-center bg-white p-3 rounded-full border-4 border-[#ff0080] shadow-md mt-3">
            <motion.input type="text" value={inputs[index]} onChange={(e) => {
              const newInputs = [...inputs];
              newInputs[index] = e.target.value;
              setInputs(newInputs);
            }} className={`p-3 border-4 rounded-full bg-[#f4e8df] w-28 text-center text-lg font-bold outline-none border-[#ff0080] ${validated[index] ? "bg-green-200" : ""}`} animate={shake[index] ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.2 }} />
            <button onClick={() => handleValidation(index)} className="bg-[#ff0080] text-white px-5 py-4 rounded-full shadow-md ml-3 text-lg">🔑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
