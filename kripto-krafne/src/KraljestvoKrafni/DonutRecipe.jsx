import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import krafna0 from "../assets/img/krafne/krafna1.png";
import krafna1 from "../assets/img/krafne/krafna2.png";
import krafna2 from "../assets/img/krafne/krafna3.png";
import krafna3 from "../assets/img/krafne/krafna4.png";
import krafna4 from "../assets/img/krafne/krafna5.png";
import flagImage from "../assets/img/krafne/flag.png";

const imageMap = {
    'krafna0': krafna0,
    'krafna1': krafna1,
    'krafna2': krafna2,
    'krafna3': krafna3,
    'krafna4': krafna4,
    'flag': flagImage,
};

const DonutRecipe = () => {
    const [donuts, setDonuts] = useState([]);
    const [selectedDonut, setSelectedDonut] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonuts = async () => {
            try {
                const mockDonuts = [
                    { id: 1, ime: 'Kakao krafna', slika: 'krafna0', tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.', nadjev: 'Kakao krema s mrvicama čokolade', priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.', vrijeme_pripreme: '45 minuta' },
                    { id: 2, ime: 'Vanilija krafna', slika: 'krafna1', tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.', nadjev: 'Krema od vanilije sa šarenim mrvicama', priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.', vrijeme_pripreme: '40 minuta' },
                    { id: 3, ime: 'Jagodica krafna', slika: 'krafna2', tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.', nadjev: 'Krema od jagode sa šarenim mrvicama', priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.', vrijeme_pripreme: '50 minuta' },
                    { id: 4, ime: 'Cimet krafna', slika: 'krafna3', tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.', nadjev: 'Krema od cimeta i lješnjaka sa cvijetovima badema', priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.', vrijeme_pripreme: '55 minuta' },
                    { id: 5, ime: 'Kokos krafna', slika: 'krafna4', tijesto: '250 g brašna, 125 g maslaca, 100 g šećera, prstohvat soli, 1 jaje, 1 vanilin šećer, 1 prašak za pecivo.', nadjev: 'Krema od kokosa i bijele čokolade', priprema: 'Razvaljaj tijesto i ostavi da se dižu 30 minuta. Prži u zagrijanom ulju dok ne postanu zlatne.', vrijeme_pripreme: '60 minuta' },
                    { id: 6, ime: 'Šifrirana krafna', slika: 'flag', tijesto: 'Koliko dobro čitaš nule i jedinice?', nadjev: '00110110 01100010 00100000 00110111 00110010 00100000 00110110 00110001 00100000 00110110 00110110 00100000 00110110 01100101 00100000 00110110 00110001 00100000 00110111 01100010 00100000 00110110 00110100 00100000 00110011 00110000 00100000 00110111 00110101 00100000 00110110 00110111 00100000 00110110 00111000 00100000 00110110 01100101 00100000 00110111 00110101 00100000 00110111 00110100 00100000 00110101 01100110 00100000 00110110 00111000 00100000 00110011 00110100 00100000 00110111 00111000 00100000 00110111 01100100', priprema: '', vrijeme_pripreme: '' }
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
            const donut = donuts.find(d => d.id === parseInt(id));
            if (donut) setSelectedDonut(donut);
            else navigate('/recipe/1');
        }
    }, [id, donuts, navigate]);

    const handleDonutSelect = (donutId) => navigate(`/recipe/${donutId}`);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{
                    width: 40, height: 40,
                    border: '3px solid var(--glass-border)',
                    borderTopColor: 'var(--accent)',
                    borderRadius: '50%',
                    animation: 'rotateDonut 0.8s linear infinite'
                }} />
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: 40
                }}>
                    Recepti
                </h1>

                {/* Donut selector tabs */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    justifyContent: 'center',
                    marginBottom: 40
                }}>
                    {donuts.filter(d => d.id !== 6).map((donut) => (
                        <button
                            key={donut.id}
                            onClick={() => handleDonutSelect(donut.id)}
                            className={selectedDonut?.id === donut.id ? 'btn btn-primary' : 'btn btn-ghost'}
                            style={{ fontSize: '0.875rem', padding: '8px 18px' }}
                        >
                            {donut.ime}
                        </button>
                    ))}
                </div>

                {/* Recipe detail */}
                {selectedDonut && (
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 0,
                            alignItems: 'stretch'
                        }}>
                            {/* Image */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 40,
                                background: 'var(--bg-elevated)',
                                borderRight: '1px solid var(--glass-border)'
                            }}>
                                <img
                                    src={imageMap[selectedDonut.slika]}
                                    alt={selectedDonut.ime}
                                    style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }}
                                />
                            </div>

                            {/* Details */}
                            <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <h2 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.6rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)'
                                }}>
                                    {selectedDonut.ime}
                                </h2>

                                {[
                                    { label: 'Tijesto', value: selectedDonut.tijesto },
                                    { label: 'Nadjev', value: selectedDonut.nadjev },
                                    selectedDonut.priprema && { label: 'Priprema', value: selectedDonut.priprema },
                                    selectedDonut.vrijeme_pripreme && { label: 'Vrijeme pripreme', value: selectedDonut.vrijeme_pripreme },
                                ].filter(Boolean).map(({ label, value }) => (
                                    <div key={label}>
                                        <p style={{
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'var(--accent)',
                                            marginBottom: 8
                                        }}>
                                            {label}
                                        </p>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.65,
                                            background: 'var(--glass-bg)',
                                            padding: '10px 14px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--glass-border)',
                                            wordBreak: 'break-all'
                                        }}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .recipe-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default DonutRecipe;
