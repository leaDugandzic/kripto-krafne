import './krafne.css';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const resultMessages = {
    hotpink: '2 besplatne Kakao Krafne',
    darkpurple: 'Upsi, ništa za tebe :(',
    lightpink: '3 besplatne Kokos Krafne',
    pink: '5% popusta za iduću kupnju',
    violet: 'Upsi, ništa za tebe :(',
    purple: 'Besplatna dostava tjedan dana',
};

const Kolo = () => {
    const wheelRef = useRef(null);
    const containerRef = useRef(null);
    const [popupMessage, setPopupMessage] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const previousEndDegree = useRef(0);
    const [searchParams] = useSearchParams();
    const showSecretCode = searchParams.get('skrivamSe') === 'izaKola';

    const getResultsAtTop = () => {
        const spinnerElement = containerRef.current;
        if (!spinnerElement) return null;

        const rect = spinnerElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const topY = rect.top + 0.05 * rect.height;
        const element = document.elementFromPoint(centerX, topY);
        if (element?.parentElement?.parentElement !== spinnerElement) return null;
        return element?.id?.trim() || null;
    };

    const spinWheel = () => {
        if (!wheelRef.current) return;

        setIsSpinning(true);
        const wheel = wheelRef.current;
        const randomAdditionalDegrees = Math.random() * 360 + 1800;
        const newEndDegree = previousEndDegree.current + randomAdditionalDegrees;

        const animation = wheel.animate(
            [
                { transform: `rotate(${previousEndDegree.current}deg)` },
                { transform: `rotate(${newEndDegree}deg)` },
            ],
            {
                duration: 4000,
                easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
                fill: 'forwards',
            }
        );

        previousEndDegree.current = newEndDegree;

        animation.onfinish = () => {

            setIsSpinning(false);
            if (showSecretCode) {
                setPopupMessage('Nova šifra: Heksametar');
                setTimeout(() => setPopupMessage(''), 3000);
                return; 
              }

            const result = getResultsAtTop();
            if (result && resultMessages[result]) {
                setPopupMessage(resultMessages[result]);
                setTimeout(() => {
                    setPopupMessage('');
                }, 3000);
            }
        };
    };


    return (
        <div className="game" id="game">
            <div className="wheel-container">
                <fieldset
                    className="ui-wheel-of-fortune"
                    ref={containerRef}
                    style={{ '--_items': 12 }}
                >
                    <ul data-itemcount="12" id="wheel" ref={wheelRef}>
                        {[
                            'hotpink',
                            'darkpurple',
                            'lightpink',
                            'pink',
                            'violet',
                            'purple',
                            'hotpink',
                            'darkpurple',
                            'lightpink',
                            'pink',
                            'violet',
                            'purple',
                        ].map((color, index) => (
                            <li key={index} id={color}></li>
                        ))}
                    </ul>
                    <button type="button"></button>
                </fieldset>
                <button id="spin" onClick={spinWheel} disabled={isSpinning}>
                    Zavrti kolo
                </button>
            </div>

            <div className="tableText">
                <h1 className="naslov">Zavrti kolo i otkrij pravi promo kod</h1>
                <table>
                    <tbody>
                        {Object.entries(resultMessages).map(([color, msg]) => (
                            <tr key={color} className='bojice' >
                                <td className="boje"  id={color}></td>
                                <td>{msg}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {popupMessage && (
                <div className="popup active" id="popup">
                    <div className="boxPop">
                        <h2>Dobili ste:</h2>
                        <br />
                        <h1>{popupMessage}</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kolo;
