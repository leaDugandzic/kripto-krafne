import "../KraljestvoKrafni/krafne.css";
import Logo from "../assets/img/logo.png";
import Youtube from "../assets/img/footerimg/youtube.png";
import Instagram from "../assets/img/footerimg/instagram.png";
import Facebook from "../assets/img/footerimg/facebook.png";
import Tiktok from "../assets/img/footerimg/images.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="kk-footer">
      <div className="kk-footer__inner">
        {/* Top section */}
        <div className="kk-footer__top">
          {/* Brand col */}
          <div className="kk-footer__brand">
            <Link to="/" className="kk-footer__logo-link">
              <img src={Logo} alt="Kripto Krafne logo" className="kk-footer__logo-img" />
              <span className="kk-footer__logo-name title-font">Kripto Krafne</span>
            </Link>
            <p className="kk-footer__tagline">
              Uči kriptografiju sloj po sloj — s malo šećera u prahu.
            </p>
            <div className="kk-footer__social">
              <a href="https://www.instagram.com/kriptokrafne" target="_blank" rel="noopener noreferrer" className="kk-footer__social-link" aria-label="Instagram">
                <img src={Instagram} alt="Instagram" />
              </a>
              <a href="https://youtube.com/@kriptokrafne" target="_blank" rel="noopener noreferrer" className="kk-footer__social-link" aria-label="YouTube">
                <img src={Youtube} alt="YouTube" />
              </a>
              <a href="https://www.facebook.com/share/1B9ZmJ2u8b/" target="_blank" rel="noopener noreferrer" className="kk-footer__social-link" aria-label="Facebook">
                <img src={Facebook} alt="Facebook" />
              </a>
              <a href="https://www.tiktok.com/@kriptokrafne" target="_blank" rel="noopener noreferrer" className="kk-footer__social-link" aria-label="TikTok">
                <img src={Tiktok} alt="TikTok" />
              </a>
            </div>
          </div>

          

          {/* Contact col */}
          <div className="kk-footer__col">
            <h3 className="kk-footer__col-heading">Kontaktirajte nas</h3>
            <ul className="kk-footer__list">
              <li>
                <a href="tel:+1234567890" className="kk-footer__link">
                  📞 +123 456 7890
                </a>
              </li>
              <li>
                <a href="mailto:kriptokrafne@gmail.com" className="kk-footer__link">
                  ✉️ kriptokrafne@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="kk-footer__divider" />

        {/* Bottom bar */}
        <div className="kk-footer__bottom">
          <p className="kk-footer__copy">
            © 2024 Izradile Lea Dugandžić, Ana Čikeš i Ana Šimović uz mentorstvo nastavnice Nikoline Smilović
          </p>
          <a href="https://policies.google.com/terms?hl=en-US" target="_blank" rel="noopener noreferrer" className="kk-footer__terms">
            Terms & Conditions
          </a>
        </div>
      </div>

      <style>{`
        .kk-footer {
          font-family: var(--font-body);
          background: var(--bg-elevated);
          border-top: 1px solid var(--glass-border);
          margin-top: 80px;
        }

        .kk-footer__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 40px 32px;
        }

        .kk-footer__top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 40px;
        }

        /* Brand */
        .kk-footer__brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .kk-footer__logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          width: fit-content;
        }

        .kk-footer__logo-img {
          height: 48px;
          width: auto;
          transition: transform var(--transition-base);
        }
        .kk-footer__logo-link:hover .kk-footer__logo-img {
          transform: rotate(12deg) scale(1.05);
        }

        .kk-footer__logo-name {
          font-size: 1.25rem;
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }
        .kk-footer__logo-link:hover .kk-footer__logo-name { color: var(--accent); }

        .kk-footer__tagline {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 280px;
        }

        .kk-footer__social {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .kk-footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          transition: all var(--transition-fast);
          overflow: hidden;
        }

        .kk-footer__social-link img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          transition: transform var(--transition-fast), filter var(--transition-fast);
          filter: grayscale(0.4);
        }

        .kk-footer__social-link:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow-soft);
        }
        .kk-footer__social-link:hover img {
          transform: scale(1.1);
          filter: grayscale(0);
        }

        /* Columns */
        .kk-footer__col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .kk-footer__col-heading {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 4px;
        }

        .kk-footer__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .kk-footer__link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast), padding-left var(--transition-fast);
          display: block;
        }
        .kk-footer__link:hover {
          color: var(--text-primary);
          padding-left: 4px;
        }

        /* Divider */
        .kk-footer__divider {
          height: 1px;
          background: var(--glass-border);
          margin-bottom: 24px;
        }

        /* Bottom */
        .kk-footer__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .kk-footer__copy {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.5;
          max-width: 600px;
        }

        .kk-footer__terms {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color var(--transition-fast);
          white-space: nowrap;
        }
        .kk-footer__terms:hover { color: var(--accent); }

        /* Responsive */
        @media (max-width: 900px) {
          .kk-footer__top {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .kk-footer__brand {
            grid-column: 1 / -1;
          }
          .kk-footer__inner {
            padding: 40px 24px 24px;
          }
        }

        @media (max-width: 560px) {
          .kk-footer__top {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .kk-footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
          .kk-footer__inner {
            padding: 32px 20px 20px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
