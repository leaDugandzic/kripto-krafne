import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './krafne.css'; 

function Menu() {
//   const [items, setItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`http://localhost/kriptoKrafne/kripto-krafne/kripto-krafne/src/backend/menu.php`);
//       setItems(response.data);
//     } catch (error) {
//       console.error("There was an error fetching the items:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery) {
//       try {
//         const response = await axios.get(`'http://localhost/kriptoKrafne/kripto-krafne/kripto-krafne/src/backend/search.php'`, {
//           params: { search: searchQuery }
//         });
//         setItems(response.data);
//       } catch (error) {
//         console.error("Error during search:", error);
//       }
//     }
//   };

  return (
    <div className="menu" id="menu">
      {/* <div className="top">
        <div className="naslov-container">
          <h1 className="naslov">Meni</h1>
          <img src="img/logo.png" alt="roza krafna" id="draggable" />
        </div>
        <form onSubmit={handleSearch} className="inputi">
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

      <div className="items">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          items.length > 0 ? (
            items.map((item) => (
              <div className="item" key={item.id}>
                <img src={item.slika} alt={item.ime} />
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
      </div> */}
    </div>
  );
}

export default Menu;
