import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const donuts = [
    {
        id: 1,
        src: "../src/assets/img/yellow-donut.webp",
        code: "1",
        position: { top: "60%", left: "15%" },
        route: "/radnici"
    },
    {
        id: 2,
        src: "../src/assets/img/brown-drizzle-donut.webp",
        code: "5",
        position: { top: "50%", left: "42%" },
        route: "/reverse"
    },
    {
        id: 3,
        src: "../src/assets/img/white-dotted-donut.webp",
        code: "6",
        position: { top: "60%", left: "70%" },
        route: "/menu"
    },
    {
        id: 4,
        src: "../src/assets/img/blue-donut.webp",
        code: "4",
        position: { top: "15%", left: "83%" },
        route: "/dragdrop"
    },
    {
        id: 5,
        src: "../src/assets/img/plain-donut.webp",
        code: "3",
        position: { top: "5%", left: "50%" },
        route: "/kolo"
    },
    {
        id: 6,
        src: "../src/assets/img/green-donut.webp",
        code: "2",
        position: { top: "20%", left: "20%" },
        route: "/images"
    },
];

const lines = [
    {
        id: "1and5",
        src: "../src/assets/img/1and5.png",
        position: { top: "55%", left: "23%" },
        width: "22vw",
        // height: "5vh",
    },
    {
        id: "two",
        src: "../src/assets/img/two.png",
        position: { top: "46%", left: "50%" },
        width: "25vw",
        // height: "5vh",
    },
    {
        id: "three",
        src: "../src/assets/img/three.png",
        position: { top: "35%", left: "70%" },
        width: "25vw",
        // height: "5vh",
        transform: "scaleY(-1) rotate(90deg)",
    },
    {
        id: "four",
        src: "../src/assets/img/four.png",
        position: { top: "5%", left: "61%" },
        width: "27vw",
        // height: "5vh",
        transform: " rotate(230deg)",
    },
    {
        id: "five",
        src: "../src/assets/img/two.png",
        position: { top: "10%", left: "28%" },
        width: "26vw",
        // height: "5vh",
        transform: "scaleY(-1) ",
    },
    {
        id: "six",
        src: "../src/assets/img/six.png",
        position: { top: "25%", left: "8%" },
        width: "16vw",
        // height: "5vh",
        transform: "scaleY(-1) ",
    },
];

const castlePosition = { top: "5%", left: "6%", width: "10vw", zIndex: 4 };

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
        <div id="game" className="relative w-full h-screen bg-[#ffface] flex items-center justify-center overflow-hidden">
            <img
                src="../src/assets/img/castle.png"
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
                    <Link to={donut.route}>
                        <motion.img
                            src={donut.src}
                            alt="Donut"
                            className="w-28 md:w-38"
                            animate={validated[index] ? { rotate: 360 } : {}}
                            transition={{ duration: 1 }}
                        />
                    </Link>
                    <div className="flex items-center bg-white p-2 md:p-3 rounded-full border-4 border-[#ff0080] shadow-md mt-2">
                        <motion.input
                            type="text"
                            value={inputs[index]}
                            onChange={(e) => {
                                const newInputs = [...inputs];
                                newInputs[index] = e.target.value;
                                setInputs(newInputs);
                            }}
                            className={`p-2 md:p-3 border-4 rounded-full bg-[#f4e8df] w-16 md:w-28 text-center text-lg font-bold outline-none border-[#ff0080] ${validated[index] ? "bg-green-200" : ""
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
