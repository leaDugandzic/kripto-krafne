import React, { useEffect, useState } from 'react';
import "./krafne.css";
import Radnik from "../assets/radnici/radnik.jpg";
import Radnik1 from "../assets/radnici/radnik2.jpeg";
import Radnik2 from "../assets/radnici/radnik3.jpeg";
import Radnik3 from "../assets/radnici/radnik4.jpg";
import Radnik4 from "../assets/radnici/radnik5.jpg";
import Radnik5 from "../assets/radnici/radnik6.jpg";
import Radnik8 from "../assets/radnici/radnik8.jpg";
import Radnik7 from "../assets/radnici/radnik7.jpg";
import TopSecret from "../assets/radnici/topsecret.jpg";
import axios from 'axios';

function Radnici() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios.get('localhost/kripto-krafne/kripto-krafne/src/backend/cookies.php', { withCredentials: true })
      .then(response => {
        setIsAdmin(response.data.isAdmin);
        console.log(isAdmin);
      })
      .catch(error => {
        console.error("There was an error fetching the admin status:", error);
      });
  }, []);

  return (
    <div>
      <div className="mainRadnici">
        <h1 className="radniciNaslov">Naši radnici</h1>

        <div className="radnici" id="Radnici">
          <div className="radnik">
            <img className="profile-pic" src={Radnik} alt="Ivana Kovač" />
            <h1 className="profile-name">Ivana Kovač</h1>
            <h3 className="profile-posao">Dekoratorka krafni</h3>
            <p className="profile-bio">Stručnjakinja za dekoriranje krafni, poznata po kreativnim i unikatnim dizajnima.</p>
          </div>

          <div className="radnik">
            <img className="profile-pic" src={Radnik1} alt="Marko Horvat" />
            <h1 className="profile-name">Marko Horvat</h1>
            <h3 className="profile-posao">Dostavljač</h3>
            <p className="profile-bio">Dostavlja svježe krafne, poznat po točnosti i prijateljskom pristupu.</p>
          </div>

          <div className="radnik">
            <img className="profile-pic" src={Radnik2} alt="Ana Petrović" />
            <h1 className="profile-name">Ana Petrović</h1>
            <h3 className="profile-posao">Glavna pekarica</h3>
            <p className="profile-bio">Iskusna majstorica krafni, zadužena za kreiranje recepata i vođenje tima.</p>
          </div>

          <div className="radnik">
            <img className="profile-pic" src={Radnik3} alt="Lana Marušić" />
            <h1 className="profile-name">Lana Marušić</h1>
            <h3 className="profile-posao">Prodavačica</h3>
            <p className="profile-bio">Ljubazna i uvijek spremna pomoći kupcima s izborom savršene krafne.</p>
          </div>

          <div className="radnik">
            <img className="profile-pic" src={Radnik4} alt="Petra Jurković" />
            <h1 className="profile-name">Petra Jurković</h1>
            <h3 className="profile-posao">Pekarica specijalizirana za punjenja</h3>
            <p className="profile-bio">Specijalistica za bogata punjenja krafni s raznolikim okusima.</p>
          </div>

          {isAdmin ? (
            <div className="radnik">
              <img className="profile-pic" src={Radnik5} alt="Matea Cezar" />
              <h1 className="profile-name">Matea Cezar</h1>
              <h3 className="profile-posao">Menadžer</h3>
              <p className="profile-bio">/jodced</p>
            </div>
          ) : (
            <div className="radnik">
              <img className="profile-pic" src={TopSecret} alt="Tajni investitor" />
              <h1 className="profile-name">Tajni investitor</h1>
              <h3 className="profile-posao">Menadžer</h3>
              <p className="profile-bio">Informacija moguće isključivo admistratoru</p>
            </div>
          )}

          <div className="radnik">
            <img
              className="profile-pic"
              src={Radnik7}
              alt="Kristina Ugrin"
            />
            <h1 className="profile-name">Kristina Ugrin</h1>
            <h3 className="profile-posao">Marketing menadžer</h3>
            <p className="profile-bio">Stručnjakinja za tradicionalne recepte krafni s 15 godina iskustva u pekarstvu.</p>
          </div>

          <div className="radnik">
            <img
              className="profile-pic"
              src={Radnik8}
              alt="Marin Zoranić"
            />
            <h1 className="profile-name">Marin Zoranić</h1>
            <h3 className="profile-posao">Šef kuhinje za inovativne okuse</h3>
            <p className="profile-bio">Kreator jedinstvenih kombinacija okusa koji će vas iznenaditi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Radnici;
