import { useState, useEffect } from "react";

const Post = () => {
    const [naslov, setNaslov] = useState("");
    const [opis, setOpis] = useState("");
    const [kategorija, setKategorija] = useState("");
    const [kategorije, setKategorije] = useState([]);

    // Učitaj kategorije iz backend-a
    useEffect(() => {
        fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getCategories.php", {
            method: "GET",
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setKategorije(data))
            .catch(err => console.error("Ne mogu učitati kategorije:", err));
    }, []);

    const handleObjavi = () => {
        let apiPost = "http://localhost/kripto-krafne/kripto-krafne/src/backend/post.php";

        let data = {
            Naslov: naslov,
            Opis: opis,
            Kategorija: kategorija,
        };

        fetch(apiPost, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
            .then(async response => {
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch {
                    console.error("Backend vratio:", text);
                    alert("Greška!");
                }
            })
            .then((data) => {
                if (data?.success) {
                    alert("Uspješno objavljeno!");
                }
            });
    };

    return (
        <div className="flex justify-center mt-10">
            <div className="flex flex-col gap-4 p-6 max-w-2xl w-full bg-white rounded-lg shadow-md">

                <label>Naslov:</label>
                <input
                    type="text"
                    className="text-black w-full p-3 rounded-md border border-gray-300"
                    value={naslov}
                    onChange={(e) => setNaslov(e.target.value)}
                />

                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn bg-white text-black border w-full justify-between"
                    >
                        {kategorija
                            ? kategorije.find(k => k.id === kategorija)?.category_name
                            : "Odaberi kategoriju"}
                    </div>

                    <ul
                        tabIndex={-1}
                        className="dropdown-content menu bg-white rounded-box z-10 w-52 p-2 shadow-sm"
                    >
                        {kategorije.map((k) => (
                            <li key={k.id}>
                                <a
                                    onClick={() => {
                                        setKategorija(k.id);
                                        document.activeElement.blur(); 
                                    }}
                                >
                                    {k.category_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <label>Opis:</label>
                <textarea
                    rows="5"
                    className="text-black w-full p-3 rounded-md border border-gray-300"
                    value={opis}
                    onChange={(e) => setOpis(e.target.value)}
                />

                <button
                    className="bg-pink-500 text-white italic px-6 py-2 rounded-full shadow-md hover:bg-pink-600 transition-all"
                    onClick={handleObjavi}
                >
                    Objavi
                </button>

            </div>
        </div>
    );
};

export default Post;
