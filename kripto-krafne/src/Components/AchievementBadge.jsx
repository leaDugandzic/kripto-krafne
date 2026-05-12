import { FaMedal, FaTrophy, FaCrown, FaFire, FaStar, FaBolt, FaUsers, FaKey } from 'react-icons/fa';
import { GiCook } from 'react-icons/gi';

export const ACHIEVEMENTS = {
    dobrodosao:     { name: 'Dobrodošao!',      desc: 'Registrirao/la si se',            tier: 'bronze',    icon: FaMedal  },
    tim_igrac:      { name: 'Tim Igrač',         desc: 'Stvorio/la ili se pridružio timu', tier: 'bronze',    icon: FaUsers  },
    dnevna_doza:    { name: 'Dnevna Doza',       desc: '3 dana zaredom na platformi',      tier: 'silver',    icon: FaFire   },
    prva_krafna:    { name: 'Prva Krafna',        desc: 'Riješio/la prvi CTF zadatak',      tier: 'silver',    icon: FaKey    },
    secer_i_sol:    { name: 'Šećer i Sol',        desc: '3 CTF zadatka riješena',           tier: 'silver',    icon: FaStar   },
    tjedan_krafni:  { name: 'Tjedan Krafni',      desc: '7 dana zaredom na platformi',      tier: 'gold',      icon: FaFire   },
    slatka_pobjeda: { name: 'Slatka Pobjeda',     desc: 'Tim riješio sve zadatke',          tier: 'gold',      icon: FaTrophy },
    brzi_prsti:     { name: 'Brzi Prsti',         desc: 'Riješio/la zadatak u prvih 10 min',tier: 'legendary', icon: FaBolt   },
    solo_kuhar:     { name: 'Solo Kuhar',          desc: 'Pobijedio/la sam/a bez tima!',     tier: 'legendary', icon: GiCook   },
};

const TIERS = {
    bronze:    { gradient: 'linear-gradient(135deg, #cd7f32, #8b4513)', glow: 'rgba(205,127,50,0.4)',  color: '#cd7f32', label: 'Bronze'    },
    silver:    { gradient: 'linear-gradient(135deg, #d0d0d0, #888888)', glow: 'rgba(192,192,192,0.4)', color: '#c0c0c0', label: 'Silver'    },
    gold:      { gradient: 'linear-gradient(135deg, #ffd700, #ff8c00)', glow: 'rgba(255,215,0,0.45)',  color: '#ffd700', label: 'Gold'      },
    legendary: { gradient: 'linear-gradient(135deg, #b845f5, #ff2d78)', glow: 'rgba(184,69,245,0.45)', color: '#b845f5', label: 'Legendary' },
};

const SIZES = {
    sm: { box: 48, icon: 16, name: '0.68rem', tier: false },
    md: { box: 68, icon: 24, name: '0.75rem', tier: true  },
    lg: { box: 88, icon: 32, name: '0.85rem', tier: true  },
};

export default function AchievementBadge({ achievementKey, earned = true, size = 'md', showLabel = true }) {
    const ach = ACHIEVEMENTS[achievementKey];
    if (!ach) return null;

    const tier = TIERS[ach.tier];
    const Icon = ach.icon;
    const s = SIZES[size] || SIZES.md;

    return (
        <div
            title={`${ach.name} — ${ach.desc}${!earned ? ' (nije otključano)' : ''}`}
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                opacity: earned ? 1 : 0.55,
                transition: 'transform 0.2s',
                cursor: 'default',
            }}
            onMouseEnter={e => { if (earned) e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
            <div style={{
                width: s.box,
                height: s.box,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: earned ? tier.gradient : 'linear-gradient(135deg, #6b7280, #4b5563)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: earned ? `0 0 18px ${tier.glow}, 0 4px 12px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.25)',
                flexShrink: 0,
            }}>
                <Icon size={s.icon} color={earned ? '#fff' : 'rgba(255,255,255,0.6)'} style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))' }} />
            </div>

            {showLabel && (
                <div style={{ textAlign: 'center', maxWidth: s.box + 20 }}>
                    <p style={{ fontSize: s.name, fontWeight: 700, color: earned ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.2, marginBottom: 1 }}>
                        {ach.name}
                    </p>
                    {s.tier && (
                        <p style={{ fontSize: '0.6rem', fontWeight: 700, color: earned ? tier.color : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {earned ? tier.label : '???'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
