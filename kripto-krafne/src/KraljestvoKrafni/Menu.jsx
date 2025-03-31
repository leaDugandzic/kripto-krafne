import React, { useEffect, useState } from 'react';
import './krafne.css'; 
import krafna0 from "../assets/img/krafne/krafna1.png";
import krafna1 from "../assets/img/krafne/krafna2.png";
import krafna2 from "../assets/img/krafne/krafna3.png";
import krafna3 from "../assets/img/krafne/krafna4.png";
import krafna4 from "../assets/img/krafne/krafna5.png";
import krafna5 from "../assets/img/krafne/krafna6.png";
import krafna6 from "../assets/img/krafne/krafna7.png";
import flag from "../assets/img/krafne/flag.png";
const imageMap = {
  'Kakao Krafna': krafna0,
  'Vanilija Krafna': krafna1,
  'Jagodica Krafna': krafna2,
  'Cimet Krafna': krafna3,
  'Kokos Krafna': krafna4,
  'Karamela Krafna': krafna5,
  'Pistacija Krafna': krafna6,
  'Pronašao si bazu': flag, 
};

function Menu() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/menu.php");
      const data = await response.json();
      console.log("Fetched Data:", data); 

      setItems(data);
    } catch (error) {
      console.error("There was an error fetching the items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      setIsLoading(true); 
      try {
        const response = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/search.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ search: searchQuery }), 
        });

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsLoading(false);  
      }
    }
  };

  return (
    <div className="menu1 h-[180vh]" id="menu">
      <div className="top">
        <div className="naslov-container">
          <h1 className="naslov">Meni</h1>
          <img src="img/logo.png" alt="roza krafna" id="draggable" />
        </div>
        <form  className="inputi" onSubmit={handleSearch}>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Pretraži krafne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input type="submit" id="searchButton" value="Pretraži" />
        </form>
      </div>

      <div className="items w-[90%]">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          items.length > 0 ? (
            items.map((item) => (
              <div className="item " key={item.id}>
              <img src={imageMap[item.ime] || krafna0} alt={item.ime} />
                <div className="red">
                  <h4>{item.ime}</h4>
                  <p>{item.cijena}€</p>
                </div>
                <div className="red">
                  <p>{item.nadjev}</p>
                  <button>+</button>
                </div>
              </div>
            ))
          ) : (
            <p>Nema rezultata za pretragu.</p>
          )
        )}
      </div>
    </div>
  );
}

export default Menu;
