import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import krafna0 from "../assets/img/krafne/krafna1.png";
import krafna1 from "../assets/img/krafne/krafna2.png";
import krafna2 from "../assets/img/krafne/krafna3.png";
import krafna3 from "../assets/img/krafne/krafna4.png";
import krafna4 from "../assets/img/krafne/krafna5.png";
import flagImage from "../assets/img/krafne/flag.png";

const DonutRecipe = () => {
    const [donuts, setDonuts] = useState([]);
    const [selectedDonut, setSelectedDonut] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const imageMap = {
        'krafna0': krafna0,
        'krafna1': krafna1,
        'krafna2': krafna2,
        'krafna3': krafna3,
        'krafna4': krafna4,
        'flag': flagImage,
    };

    useEffect(() => {
        const fetchDonuts = async () => {
            try {
                const mockDonuts = [
                    {
                        id: 1,
                        ime: 'Kakao krafna',
                        slika: 'krafna0',
                        tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.',
                        nadjev: 'Kakao krema s mrvicama čokolade',
                        priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.',
                        vrijeme_pripreme: '45 minuta'
                    },
                    {
                        id: 2,
                        ime: 'Vanilija krafna',
                        slika: 'krafna1',
                        tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.',
                        nadjev: 'Krema od vanilije sa šarenim mrvicama',
                        priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.',
                        vrijeme_pripreme: '40 minuta'
                    },
                    {
                        id: 3,
                        ime: 'Jagodica krafna',
                        slika: 'krafna2',
                        tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.',
                        nadjev: 'Krema od jagode sa šarenim mrvicama',
                        priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.',
                        vrijeme_pripreme: '50 minuta'
                    },
                    {
                        id: 4,
                        ime: 'Cimet krafna',
                        slika: 'krafna3',
                        tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.',
                        nadjev: 'Krema od cimeta i lješnjaka sa cvijetovima badema',
                        priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.',
                        vrijeme_pripreme: '55 minuta'
                    },
                    {
                        id: 5,
                        ime: 'Kokos krafna',
                        slika: 'krafna4',
                        tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.',
                        nadjev: 'Krema od kokosa i bijele čokolade',
                        priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.',
                        vrijeme_pripreme: '60 minuta'
                    },
                    {
                        id: 6,
                        ime: 'Šifrirana krafna',
                        slika: 'flag',
                        tijesto: 'Koliko dobro čitaš nule i jedinice?',
                        nadjev: '00110110 01100010 00100000 00110111 00110010 00100000 00110110 00110001 00100000 00110110 00110110 00100000 00110110 01100101 00100000 00110110 00110001 00100000 00110111 01100010 00100000 00110110 00110100 00100000 00110011 00110000 00100000 00110111 00110101 00100000 00110110 00110111 00100000 00110110 00111000 00100000 00110110 01100101 00100000 00110111 00110101 00100000 00110111 00110100 00100000 00110101 01100110 00100000 00110110 00111000 00100000 00110011 00110100 00100000 00110111 00111000 00100000 00110111 01100100',
                        priprema: '',
                        vrijeme_pripreme: ''
                    }
                ];

                setDonuts(mockDonuts);
                setSelectedDonut(mockDonuts[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching donuts:', error);
                setLoading(false);
            }
        };

        fetchDonuts();
    }, []);

    useEffect(() => {
        if (donuts.length > 0) {
            const donutId = parseInt(id);
            const donut = donuts.find(d => d.id === donutId);
            if (donut) {
                setSelectedDonut(donut);
            } else {
                navigate('/recipe/1');
            }
        }
    }, [id, donuts, navigate]);

    const handleDonutSelect = (donutId) => {
        navigate(`/recipe/${donutId}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-center pb-8 text-pink-500 title-font">Recepti</h1>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
                {donuts
                    .filter(donut => donut.id !== 6) // Šifrirana ostaje skrivena
                    .map((donut) => (
                        <button
                            key={donut.id}
                            onClick={() => handleDonutSelect(donut.id)}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedDonut?.id === donut.id
                                ? 'bg-pink-600 text-white'
                                : 'bg-pink-100 text-pink-800 hover:bg-pink-200 border-2 border-dashed border-pink-500 rounded-2xl'
                                }`}
                        >
                            {donut.ime}
                        </button>
                    ))}
            </div>

            {selectedDonut && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img
                            src={imageMap[selectedDonut.slika]}
                            alt={selectedDonut.ime}
                            className="max-w-full h-auto"
                        />
                    </div>

                    <div className="w-full md:w-1/2 space-y-4 bg-[#ffffff] border-3 border-dashed border-pink-500 rounded-2xl p-5">
                        <h2 className="text-2xl font-bold text-pink-500 title-font">{selectedDonut.ime}</h2>

                        <div>
                            <h3 className="font-bold text-pink-600">Tijesto:</h3>
                            <p className="text-pink-950 bg-pink-100 p-2 rounded-2xl">{selectedDonut.tijesto}</p>
                        </div>

                        <div>
                            <p className="font-bold text-pink-600">Nadjev:</p>
                            <p className="text-pink-950 bg-pink-100 p-2 rounded-2xl">{selectedDonut.nadjev}</p>
                        </div>

                        {selectedDonut.priprema && (
                            <div>
                                <p className="font-bold text-pink-600">Priprema:</p>
                                <p className="text-pink-950 bg-pink-100 p-2 rounded-2xl">{selectedDonut.priprema}</p>
                            </div>
                        )}

                        {selectedDonut.vrijeme_pripreme && (
                            <div>
                                <p className="font-bold text-pink-600">Vrijeme pripreme:</p>
                                <p className="text-pink-950 bg-pink-100 p-2 rounded-2xl">{selectedDonut.vrijeme_pripreme}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonutRecipe;
