const SPRINKLES = [
    // Top edge
    { x: 95,   y: 55,  rot: 35,   w: 4, h: 13, color: '#ffc840', op: 0.55 },
    { x: 210,  y: 35,  rot: -22,  w: 3, h: 10, color: '#ff2d78', op: 0.5  },
    { x: 370,  y: 65,  rot: 58,   w: 4, h: 13, color: '#ff7b35', op: 0.5  },
    { x: 530,  y: 28,  rot: -48,  w: 3, h: 10, color: '#b845f5', op: 0.45 },
    { x: 720,  y: 70,  rot: 72,   w: 4, h: 13, color: '#ffc840', op: 0.55 },
    { x: 890,  y: 38,  rot: -18,  w: 3, h: 10, color: '#ff2d78', op: 0.45 },
    { x: 1060, y: 58,  rot: 42,   w: 4, h: 13, color: '#ff7b35', op: 0.5  },
    { x: 1230, y: 32,  rot: -65,  w: 3, h: 10, color: '#ffc840', op: 0.5  },
    { x: 1380, y: 72,  rot: 28,   w: 4, h: 13, color: '#b845f5', op: 0.45 },
    // Left edge
    { x: 45,   y: 185, rot: 50,   w: 3, h: 10, color: '#ffc840', op: 0.5  },
    { x: 65,   y: 310, rot: -35,  w: 4, h: 13, color: '#ff2d78', op: 0.5  },
    { x: 38,   y: 440, rot: 68,   w: 3, h: 10, color: '#ff7b35', op: 0.45 },
    { x: 70,   y: 570, rot: -52,  w: 4, h: 13, color: '#b845f5', op: 0.5  },
    { x: 48,   y: 700, rot: 30,   w: 3, h: 10, color: '#ffc840', op: 0.45 },
    // Right edge
    { x: 1395, y: 175, rot: -42,  w: 3, h: 10, color: '#ff7b35', op: 0.5  },
    { x: 1410, y: 310, rot: 28,   w: 4, h: 13, color: '#ffc840', op: 0.5  },
    { x: 1390, y: 450, rot: -62,  w: 3, h: 10, color: '#ff2d78', op: 0.45 },
    { x: 1415, y: 580, rot: 48,   w: 4, h: 13, color: '#b845f5', op: 0.5  },
    { x: 1400, y: 720, rot: -25,  w: 3, h: 10, color: '#ff7b35', op: 0.45 },
    // Bottom edge
    { x: 130,  y: 860, rot: -42,  w: 3, h: 10, color: '#ff2d78', op: 0.5  },
    { x: 290,  y: 875, rot: 58,   w: 4, h: 13, color: '#ffc840', op: 0.55 },
    { x: 480,  y: 850, rot: -28,  w: 3, h: 10, color: '#ff7b35', op: 0.5  },
    { x: 680,  y: 868, rot: 45,   w: 4, h: 13, color: '#b845f5', op: 0.45 },
    { x: 870,  y: 855, rot: -62,  w: 3, h: 10, color: '#ffc840', op: 0.5  },
    { x: 1060, y: 872, rot: 32,   w: 4, h: 13, color: '#ff2d78', op: 0.45 },
    { x: 1250, y: 848, rot: -48,  w: 3, h: 10, color: '#ff7b35', op: 0.5  },
    // Interior scattered
    { x: 195,  y: 220, rot: 55,   w: 3, h: 10, color: '#ff7b35', op: 0.35 },
    { x: 1240, y: 200, rot: -38,  w: 3, h: 10, color: '#ffc840', op: 0.3  },
    { x: 160,  y: 680, rot: 42,   w: 3, h: 10, color: '#b845f5', op: 0.3  },
    { x: 1270, y: 660, rot: -55,  w: 3, h: 10, color: '#ff2d78', op: 0.3  },
];

const RINGS = [
    { cx: 480,  cy: 160, r: 22, color: '#ffc840', op: 0.3  },
    { cx: 960,  cy: 120, r: 16, color: '#ff2d78', op: 0.28 },
    { cx: 260,  cy: 580, r: 19, color: '#ff7b35', op: 0.28 },
    { cx: 1180, cy: 540, r: 21, color: '#b845f5', op: 0.28 },
    { cx: 720,  cy: 800, r: 14, color: '#ffc840', op: 0.3  },
];

const STARS = [
    { cx: 750,  cy: 130, s: 8,  color: '#ffc840', op: 0.55 },
    { cx: 340,  cy: 390, s: 6,  color: '#ff7b35', op: 0.45 },
    { cx: 1090, cy: 360, s: 7,  color: '#ff2d78', op: 0.5  },
    { cx: 570,  cy: 760, s: 6,  color: '#b845f5', op: 0.45 },
    { cx: 1330, cy: 130, s: 7,  color: '#ffc840', op: 0.5  },
    { cx: 100,  cy: 820, s: 6,  color: '#ff7b35', op: 0.45 },
];

const DOTS = [
    { cx: 610,  cy: 90,  r: 4, color: '#ff7b35', op: 0.45 },
    { cx: 830,  cy: 50,  r: 3, color: '#ffc840', op: 0.5  },
    { cx: 1140, cy: 90,  r: 5, color: '#ff2d78', op: 0.4  },
    { cx: 115,  cy: 460, r: 4, color: '#ffc840', op: 0.4  },
    { cx: 1325, cy: 400, r: 4, color: '#ff7b35', op: 0.4  },
    { cx: 400,  cy: 840, r: 4, color: '#b845f5', op: 0.4  },
    { cx: 1000, cy: 835, r: 5, color: '#ffc840', op: 0.45 },
    { cx: 760,  cy: 870, r: 3, color: '#ff2d78', op: 0.4  },
];

const PageDecorations = () => (
    <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
        aria-hidden="true"
    >
        <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
            {/* ── Sprinkles ──────────────────────────────────────────────── */}
            {SPRINKLES.map((s, i) => (
                <rect
                    key={`sp-${i}`}
                    x={s.x - s.w / 2}
                    y={s.y - s.h / 2}
                    width={s.w}
                    height={s.h}
                    rx={s.w / 2}
                    fill={s.color}
                    opacity={s.op}
                    transform={`rotate(${s.rot}, ${s.x}, ${s.y})`}
                />
            ))}

            {/* ── Donut rings ────────────────────────────────────────────── */}
            {RINGS.map((ring, i) => (
                <g key={`rg-${i}`}>
                    <circle cx={ring.cx} cy={ring.cy} r={ring.r} stroke={ring.color} strokeWidth="3.5" fill="none" opacity={ring.op} />
                    <circle cx={ring.cx} cy={ring.cy} r={ring.r * 0.42} fill={ring.color} opacity={ring.op * 0.45} />
                </g>
            ))}

            {/* ── Sparkle stars ──────────────────────────────────────────── */}
            {STARS.map((star, i) => (
                <g key={`st-${i}`} transform={`translate(${star.cx}, ${star.cy})`} opacity={star.op}>
                    <line x1={-star.s} y1="0" x2={star.s} y2="0" stroke={star.color} strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="0" y1={-star.s} x2="0" y2={star.s} stroke={star.color} strokeWidth="1.8" strokeLinecap="round" />
                    <line x1={-star.s * 0.68} y1={-star.s * 0.68} x2={star.s * 0.68} y2={star.s * 0.68} stroke={star.color} strokeWidth="1.2" strokeLinecap="round" />
                    <line x1={star.s * 0.68} y1={-star.s * 0.68} x2={-star.s * 0.68} y2={star.s * 0.68} stroke={star.color} strokeWidth="1.2" strokeLinecap="round" />
                </g>
            ))}

            {/* ── Dots ───────────────────────────────────────────────────── */}
            {DOTS.map((d, i) => (
                <circle key={`dt-${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={d.color} opacity={d.op} />
            ))}
        </svg>
    </div>
);

export default PageDecorations;
