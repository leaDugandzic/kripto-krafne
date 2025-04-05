import "../KraljestvoKrafni/krafne.css";
import Logo from "../assets/img/logo.png";
import Youtube from "../assets/img/footerimg/youtube.png";
import X from "../assets/img/footerimg/x.png";
import Pinterest from "../assets/img/footerimg/pinterest.png";
import Instagram from "../assets/img/footerimg/instagram.png";
import Facebook from "../assets/img/footerimg/facebook.png";
import Tiktok from "../assets/img/footerimg/images.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footerDiv bg-pink-300">
      <footer>
        <div className="footerMain">
          <div className="footerMainTop">
            <div className="footerPartOne">
              <div className="footerLogo">
                <Link to="/" className="w-[600px]">
                  <div id="logo">
                    <img src={Logo} alt="logo"  />
                    <h1 className="naslov font-bold italic">Kripto Krafne</h1>
                  </div>
                </Link>
              </div>
            </div>

            <div className="footerPartTwo">
              <div className="footerTwoContainer">
                <h2 className="footerTitle">KONTAKTIRAJTE NAS</h2>
                <div className="footerContact">
                  <ul>
                    <li>
                      <h3>
                        Broj mobitela: <a href="tel:+1234567890">+123 456 7890</a>
                      </h3>
                    </li>
                    <li>
                      <h3>
                        E-mail: <a href="mailto:kraljevstvoKrafni@gmail.com">kraljevstvoKrafni@gmail.com</a>
                      </h3>
                    </li>
                    <li>
                      <h2>ZAPRATITE NAS</h2>
                      <div className="footerSocialMedia">
                        <a href="https://www.instagram.com/kriptokrafne?igsh=MTFuZHdsbXVkeG51bA==">
                          <img className="instagram" src={Instagram} alt="Instagram" />
                        </a>
                        <a href="https://youtube.com/@kriptokrafne?si=AU_UJiW2lMorAy2u">
                          <img className="facebook" src={Youtube} alt="YouTube" />
                        </a>
                        <a href="https://www.facebook.com/share/1B9ZmJ2u8b/">
                          <img className="youtube" src={Facebook} alt="Facebook" />
                        </a>
                      
                        <a href="https://www.tiktok.com/@kriptokrafne?_t=ZN-8vHDTaFgsI2&_r=1">
                          <img className="pinterest" src={Tiktok} alt="Tiktok" />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="footerMainBottom">
            <hr />
            <br />
            <div className="footerBottomContent">
              <div className="footerBottomOne">
                <h3>© 2024 Izradile Lea Dugandžić, Ana Čikeš i Ana Šimović uz mentorstvo nastavnice Nikoline Smilović</h3>
              </div>
              <div className="footerBottomTwo">
                <a href="https://policies.google.com/terms?hl=en-US">
                  <h3>TERMS AND CONDITIONS</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
