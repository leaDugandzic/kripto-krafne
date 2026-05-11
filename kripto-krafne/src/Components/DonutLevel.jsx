import { useNavigate, useParams } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import Krafna from "../assets/img/krafna.png";

const DonutLevel = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const levelStep = Number(id) % 100;
    const nextLevelId = Number(id) + 1;
    const isLastLevel = nextLevelId % 100 === 4;

    const steps = [1, 2, 3];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px 40px'
        }}>
            <div className="glass-card" style={{
                padding: '52px 48px',
                maxWidth: 480,
                width: '100%',
                textAlign: 'center',
                animation: 'fadeInUp 0.4s ease'
            }}>
                {/* Spinning donut */}
                <img
                    src={Krafna}
                    alt="Krafna"
                    style={{
                        width: 88,
                        height: 88,
                        margin: '0 auto 28px',
                        animation: 'rotateDonut 4s linear infinite',
                        filter: 'drop-shadow(0 0 20px var(--accent-glow))'
                    }}
                />

                {/* Bravo text */}
                <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 12
                }}>
                    Bravo!
                </h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40 }}>
                    Možeš li doći do svih<br />
                    <strong style={{ color: 'var(--accent)' }}>Kripto Krafni</strong>?
                </p>

                {/* Progress steps */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0,
                    marginBottom: 44
                }}>
                    {steps.map((step, i) => {
                        const isComplete = levelStep >= step;
                        const isCurrent = levelStep === step;
                        return (
                            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {isComplete ? (
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={Krafna}
                                                alt={`Level ${step}`}
                                                style={{
                                                    width: 64,
                                                    height: 64,
                                                    filter: isCurrent
                                                        ? 'drop-shadow(0 0 12px var(--accent-glow))'
                                                        : 'drop-shadow(0 0 6px rgba(255,45,120,0.4))',
                                                    animation: isCurrent ? 'rotateDonut 3s linear infinite' : 'none'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: -6, right: -6,
                                                width: 22, height: 22,
                                                borderRadius: '50%',
                                                background: 'var(--accent)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 0 8px var(--accent-glow)'
                                            }}>
                                                {step}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: 64, height: 64,
                                            borderRadius: '50%',
                                            border: '2px dashed var(--glass-border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--text-muted)',
                                            fontSize: '1.2rem',
                                            opacity: 0.5
                                        }}>
                                            ?
                                        </div>
                                    )}
                                </div>

                                {i < steps.length - 1 && (
                                    <div style={{
                                        width: 40,
                                        height: 2,
                                        background: levelStep > step
                                            ? 'linear-gradient(90deg, var(--accent), var(--purple))'
                                            : 'var(--glass-border)',
                                        margin: '0 4px',
                                        transition: 'background 0.3s'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action button */}
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(isLastLevel ? "/" : `/box/${nextLevelId}`)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '14px 32px',
                        fontSize: '1rem'
                    }}
                >
                    {isLastLevel ? (
                        <><Home size={18} /> Početna</>
                    ) : (
                        <>Level {nextLevelId % 100} <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DonutLevel;
