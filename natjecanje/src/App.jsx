import { useState } from "react";
import { motion } from "framer-motion";

const donuts = [
  {
    id: 1,
    src: "../src/img/yellow-donut.webp",
    code: "1",
    position: { top: "70%", left: "15%" },
  },
  {
    id: 2,
    src: "../src/img/brown-drizzle-donut.webp",
    code: "5",
    position: { top: "55%", left: "42%" },
  },
  {
    id: 3,
    src: "../src/img/white-dotted-donut.webp",
    code: "6",
    position: { top: "65%", left: "70%" },
  },
  {
    id: 4,
    src: "../src/img/blue-donut.webp",
    code: "4",
    position: { top: "20%", left: "85%" },
  },
  {
    id: 5,
    src: "../src/img/plain-donut.webp",
    code: "3",
    position: { top: "15%", left: "50%" },
  },
  {
    id: 6,
    src: "../src/img/green-donut.webp",
    code: "2",
    position: { top: "30%", left: "20%" },
  },
];

const lines = [
  {
    id: "1and5",
    src: "../src/img/1and5.png",
    position: { top: "60%", left: "23%" },
    width: "22vw",
  },
  {
    id: "two",
    src: "../src/img/two.png",
    position: { top: "51%", left: "50%" },
    width: "25vw",
  },
  {
    id: "three",
    src: "../src/img/three.png",
    position: { top: "40%", left: "70%" },
    width: "25vw",
    transform: "scaleY(-1) rotate(90deg)",
  },
  {
    id: "four",
    src: "../src/img/four.png",
    position: { top: "10%", left: "61%" },
    width: "27vw",
    transform: " rotate(230deg)",
  },
  {
    id: "five",
    src: "../src/img/two.png",
    position: { top: "15%", left: "28%" },
    width: "26vw",
    transform: "scaleY(-1) ",
  },
  {
    id: "six",
    src: "../src/img/six.png",
    position: { top: "35%", left: "8%" },
    width: "16vw",
    transform: "scaleY(-1) ",
  },
];

const castlePosition = { top: "5%", left: "5%", width: "10vw", zIndex: 4 };

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
    <div className="relative w-full h-screen bg-[#ffceea] flex items-center justify-center overflow-hidden p-8 md:p-12">
      <img
        src="../src/img/castle.png"
        alt="Castle"
        className="absolute"
        style={{
          top: castlePosition.top,
          left: castlePosition.left,
          width: castlePosition.width,
          zIndex: castlePosition.zIndex,
        }}
      />
      {lines.map((line) => (
        <img
          key={line.id}
          src={line.src}
          alt={line.id}
          className="absolute opacity-80"
          style={{
            top: line.position.top,
            left: line.position.left,
            width: line.width,
            height: line.height,
            transform: line.transform,
          }}
        />
      ))}
      {donuts.map((donut, index) => (
        <div
          key={donut.id}
          className="absolute flex flex-col items-center"
          style={{ top: donut.position.top, left: donut.position.left }}
        >
          <motion.img
            src={donut.src}
            alt="Donut"
            className="w-28 md:w-38"
            animate={validated[index] ? { rotate: 360 } : {}}
            transition={{ duration: 1 }}
          />
          <div className="flex items-center bg-white p-2 md:p-3 rounded-full border-4 border-[#ff0080] shadow-md mt-2">
            <motion.input
              type="text"
              value={inputs[index]}
              onChange={(e) => {
                const newInputs = [...inputs];
                newInputs[index] = e.target.value;
                setInputs(newInputs);
              }}
              className={`p-2 md:p-3 border-4 rounded-full bg-[#f4e8df] w-16 md:w-28 text-center text-lg font-bold outline-none border-[#ff0080] ${
                validated[index] ? "bg-green-200" : ""
              }`}
              animate={shake[index] ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.2 }}
            />
            <button
              onClick={() => handleValidation(index)}
              className="bg-[#ff0080] text-white px-4 md:px-5 py-2 md:py-4 rounded-full shadow-md ml-2 text-lg"
            >
              🔑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
