const DetailsSection = ({ level }) => {
    return (
        <section style={{ maxWidth: 1200, margin: '0 auto 48px', padding: '0 24px' }}>
            <div className="glass-card" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 40,
                padding: '40px 44px',
                alignItems: 'start'
            }}>
                {/* Text column */}
                <div>
                    <div style={{
                        display: 'inline-block',
                        background: 'var(--accent-soft)',
                        border: '1px solid var(--accent)',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 14px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        marginBottom: 16
                    }}>
                        Lekcija
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginBottom: 12,
                        lineHeight: 1.2
                    }}>
                        {level.name}
                    </h2>

                    <div style={{
                        width: 48, height: 3,
                        background: 'linear-gradient(90deg, var(--accent), var(--purple))',
                        borderRadius: 2,
                        marginBottom: 20
                    }} />

                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: 1.75,
                        fontSize: '0.95rem'
                    }}>
                        {level.lesson}
                    </p>

                    {level.additionalInfo && (
                        <div style={{
                            marginTop: 24,
                            padding: '16px 20px',
                            background: 'var(--accent-soft)',
                            border: '1px solid var(--accent)',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '3px solid var(--accent)'
                        }}>
                            <p style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--accent)',
                                marginBottom: 8
                            }}>
                                Ključne točke
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {level.additionalInfo}
                            </p>
                        </div>
                    )}
                </div>

                {/* Video column */}
                <div>
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            src={level.video}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                    {level.videoCaption && (
                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            marginTop: 10
                        }}>
                            {level.videoCaption}
                        </p>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .details-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
};

export default DetailsSection;
