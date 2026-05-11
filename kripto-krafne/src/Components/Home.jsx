import { Link } from 'react-router-dom';
import Obavijest from './Obavijest';

const Home = () => {
    const images = import.meta.glob('/src/assets/img/kutije/*.png', { eager: true });
    const imageArray = Object.values(images).map((img) => img.default);

    return (
        <div className="home-page">
            {/* Bottom-left floating donut — clear of level cards and chatbot */}
            <div className="home-deco-bl" aria-hidden="true">🍩</div>
            <div className="home-hero">
                <div className="home-hero__content">
                    <h1 className="home-hero__title display-font">
                        <span className="text-gradient">Kripto</span>{' '}
                        <span style={{ color: 'var(--text-primary)' }}>Krafne</span>
                    </h1>
                    <p className="home-hero__subtitle">
                        Odaberi razinu, istraži tajne kriptografije i postani meštar hakera — s malo šećera u prahu.
                    </p>
                </div>
                <div className="home-hero__decoration" aria-hidden="true">
                    🍩
                </div>
            </div>

            <Obavijest />

            <section className="home-levels">
                <h2 className="home-levels__heading display-font">
                    Odaberi krafnu
                    <span className="home-levels__heading-dot" aria-hidden="true"> •</span>
                </h2>
                <p className="home-levels__sub">Svaka kutija krije novi izazov. Koliko ih možeš riješiti?</p>

                {/* Colourful accent bar */}
                <div aria-hidden="true" style={{
                    display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, marginTop: -20
                }}>
                    {['var(--accent)', 'var(--yellow)', 'var(--orange)', 'var(--purple)', 'var(--yellow)', 'var(--accent)'].map((c, i) => (
                        <div key={i} style={{
                            width: 28, height: 5, borderRadius: 3,
                            background: c, opacity: 0.7,
                            transform: `rotate(${[-8, 4, -5, 7, -3, 6][i]}deg)`
                        }} />
                    ))}
                </div>

                <div className="home-levels__grid boxes-container">
                    {imageArray.map((src, index) => {
                        const base = index + 1;
                        const adjustedIndex = base * 100 + 1;
                        return (
                            <Link
                                key={adjustedIndex}
                                to={`/box/${adjustedIndex}`}
                                className="home-level-card"
                                aria-label={`Level ${base}`}
                            >
                                <div className="home-level-card__glow" aria-hidden="true" />
                                <img
                                    src={src}
                                    alt={`Level ${base}`}
                                    className="box-image home-level-card__img"
                                    loading="lazy"
                                />
                                <div className="home-level-card__badge">
                                    <span>Level {base}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <style>{`
                .home-page {
                    min-height: calc(100vh - var(--navbar-height));
                    padding-top: calc(var(--navbar-height) + 40px);
                    padding-bottom: 80px;
                    position: relative;
                    overflow: hidden;
                }

                /* Hero */
                .home-hero {
                    text-align: center;
                    padding: 40px 24px 24px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .home-hero__content { position: relative; z-index: 1; }

                .home-hero__title {
                    font-size: clamp(2.8rem, 7vw, 5.5rem);
                    line-height: 1;
                    margin-bottom: 16px;
                    text-shadow: 0 0 60px var(--yellow-glow);
                }

                .home-hero__subtitle {
                    font-size: clamp(0.95rem, 2vw, 1.15rem);
                    color: var(--text-secondary);
                    max-width: 520px;
                    margin: 0 auto;
                    line-height: 1.7;
                }

                .home-hero__decoration {
                    font-size: 6rem;
                    position: absolute;
                    right: 8%;
                    top: 20px;
                    animation: float 5s ease-in-out infinite;
                    opacity: 0.18;
                    pointer-events: none;
                    user-select: none;
                }

                .home-deco-bl {
                    position: absolute;
                    left: 4%;
                    bottom: 100px;
                    font-size: 5rem;
                    animation: floatSlow 7s ease-in-out infinite;
                    animation-delay: -3s;
                    opacity: 0.18;
                    pointer-events: none;
                    user-select: none;
                }

                /* Levels section */
                .home-levels {
                    padding: 20px 24px 0;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                .home-levels__heading {
                    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
                    color: var(--text-primary);
                    text-align: center;
                    margin-bottom: 8px;
                }

                .home-levels__heading-dot {
                    color: var(--accent);
                }

                .home-levels__sub {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    margin-bottom: 36px;
                }

                .home-levels__grid {
                    justify-content: center;
                }

                /* Level card */
                .home-level-card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    padding: 12px;
                    border-radius: var(--radius-lg);
                    border: 1px solid transparent;
                    transition: border-color var(--transition-base), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                    cursor: pointer;
                    animation: fadeInUp 0.4s ease both;
                }

                .home-level-card:hover {
                    border-color: var(--accent);
                    transform: translateY(-8px) scale(1.04);
                }

                .home-level-card__glow {
                    position: absolute;
                    inset: 20px;
                    background: conic-gradient(from 0deg, var(--accent-soft), var(--yellow-soft), var(--orange-soft), var(--accent-soft));
                    border-radius: 50%;
                    filter: blur(22px);
                    opacity: 0;
                    transition: opacity var(--transition-base);
                    pointer-events: none;
                    z-index: 0;
                }

                .home-level-card:hover .home-level-card__glow {
                    opacity: 1;
                }

                .home-level-card:nth-child(3n+1):hover { border-color: var(--accent); }
                .home-level-card:nth-child(3n+2):hover { border-color: var(--yellow); }
                .home-level-card:nth-child(3n+3):hover { border-color: var(--orange); }

                .home-level-card:nth-child(3n+2):hover .home-level-card__badge {
                    color: var(--yellow); border-color: var(--yellow); background: var(--yellow-soft);
                }
                .home-level-card:nth-child(3n+3):hover .home-level-card__badge {
                    color: var(--orange); border-color: var(--orange); background: var(--orange-soft);
                }

                .home-level-card__img {
                    position: relative;
                    z-index: 1;
                }

                .home-level-card__badge {
                    position: relative;
                    z-index: 1;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    padding: 3px 10px;
                    border-radius: var(--radius-full);
                    transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
                }

                .home-level-card:hover .home-level-card__badge {
                    color: var(--accent);
                    border-color: var(--accent);
                    background: var(--accent-soft);
                }

                @media (max-width: 640px) {
                    .home-hero__decoration { display: none; }
                    .home-hero { padding-top: 20px; }
                }
            `}</style>
        </div>
    );
};

export default Home;
