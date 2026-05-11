import { useState, useEffect } from "react";
import Donuts from "../assets/img/donuts.png";
import Donut from "../assets/img/donut.png";
import { Link } from "react-router-dom";

const Obavijest = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [competitionActive, setCompetitionActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkCompetitionStatus();
    const interval = setInterval(checkCompetitionStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  const checkCompetitionStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost/kripto-krafne/kripto-krafne/src/backend/competition_status.php",
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.success && data.is_active) {
        setCompetitionActive(true);
        if (!dismissed) setShowPopup(true);
      } else {
        setCompetitionActive(false);
        setShowPopup(false);
      }
    } catch {
      /* silent */
    }
  };

  if (!competitionActive) return null;

  return (
    <div className={`obavijest-wrapper${showPopup ? " popup-show" : " popup-hide"}`}>
      <div className="obavijest-card glass-card">
        {/* Decorative donut top-right */}
        <img src={Donuts} className="obavijest-deco-top" alt="" aria-hidden="true" />

        <button
          onClick={() => { setShowPopup(false); setDismissed(true); }}
          className="obavijest-close"
          aria-label="Close announcement"
        >
          ✕
        </button>

        <div className="obavijest-content">
          <div className="obavijest-badge">🔴 LIVE</div>
          <h2 className="obavijest-title display-font text-gradient">Obavijest!</h2>
          <p className="obavijest-body">
            Natjecanje Kripto Krafne je započelo! Testiraj svoje znanje, predstavljaj svoju
            školu i postani dio jedne nezaboravne priče. Mladi hakeri — pripreme su
            završile. Imate li ono što je potrebno da razotkrijete sve Kripto Krafne i
            osvojite nagradu?
          </p>
          <Link to="/ctf-game" className="btn btn-primary obavijest-cta">
            Saznaj više
          </Link>
        </div>

        {/* Floating donut bottom */}
        <Link to="/ctf-game" tabIndex={-1} aria-hidden="true">
          <img src={Donut} alt="" className="obavijest-deco-bottom animate-rotate" />
        </Link>
      </div>

      <style>{`
        .obavijest-wrapper {
          width: 100%;
          max-width: 680px;
          margin: 24px auto 48px;
          padding: 0 16px;
        }

        .obavijest-card {
          position: relative;
          padding: 36px 36px 60px;
          overflow: visible;
          border-color: var(--accent) !important;
          box-shadow: var(--shadow-md), 0 0 40px var(--accent-glow) !important;
        }

        .obavijest-deco-top {
          position: absolute;
          top: -28px;
          right: -20px;
          height: 90px;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 4px 12px var(--accent-glow));
          animation: float 4s ease-in-out infinite;
        }

        .obavijest-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast), color var(--transition-fast);
          z-index: 2;
        }
        .obavijest-close:hover {
          background: rgba(255,74,110,0.15);
          color: #ff4a6e;
          border-color: #ff4a6e;
        }

        .obavijest-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .obavijest-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--error);
          background: rgba(255,74,110,0.12);
          border: 1px solid rgba(255,74,110,0.3);
          border-radius: var(--radius-full);
          padding: 3px 10px;
          width: fit-content;
        }

        .obavijest-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          line-height: 1;
        }

        .obavijest-body {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 500px;
        }

        .obavijest-cta {
          width: fit-content;
          margin-top: 4px;
        }

        .obavijest-deco-bottom {
          position: absolute;
          bottom: -42px;
          left: 50%;
          transform: translateX(-50%);
          height: 80px;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 0 16px var(--accent-glow));
        }
      `}</style>
    </div>
  );
};

export default Obavijest;
