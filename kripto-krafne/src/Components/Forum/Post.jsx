import { useState, useEffect } from "react";

const Post = () => {
    const [naslov, setNaslov] = useState("");
    const [opis, setOpis] = useState("");
    const [kategorija, setKategorija] = useState("");
    const [kategorije, setKategorije] = useState([]);

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
        if (!naslov.trim() || !opis.trim() || !kategorija) {
            alert("Molimo popunite sva polja!");
            return;
        }

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
                    alert("Greška pri objavljivanju!");
                }
            })
            .then((data) => {
                if (data?.success) {
                    alert("Uspješno objavljeno!");
                    setNaslov("");
                    setOpis("");
                    setKategorija("");
                }
            });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-pink-500 text-center title-font">Novi post</h1>
                    <p className="text-gray-600 mt-2">Podijelite svoje misli s kripto zajednicom</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xl font-bold text-pink-300 text-gray-700 mb-2">
                            Naslov objave:
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Unesite naslov..."
                            value={naslov}
                            onChange={(e) => setNaslov(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xl font-bold text-pink-300 text-gray-700 mb-2">
                            Kategorija:
                        </label>
                        <div className="dropdown">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn bg-white text-gray-700 border border-gray-300 w-full justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {kategorija
                                    ? kategorije.find(k => k.id === kategorija)?.category_name
                                    : "Odaberi kategoriju"}
                                <span>▼</span>
                            </div>

                            <ul
                                tabIndex={-1}
                                className="dropdown-content menu bg-white rounded-lg z-10 w-full p-2 shadow-lg border border-gray-200 mt-1"
                            >
                                {kategorije.map((k) => (
                                    <li key={k.id}>
                                        <a
                                            className="px-4 py-3 hover:bg-gray-100 rounded-md transition-colors"
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
                    </div>

                    <div>
                        <label className="block text-xl font-bold text-pink-300 text-gray-700 mb-2">
                            Sadržaj objave: 
                        </label>
                        <textarea
                            rows="8"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-vertical"
                            placeholder="Napišite sadržaj vašeg posta..."
                            value={opis}
                            onChange={(e) => setOpis(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-center pt-4">
                        <button
                            className="bg-pink-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:bg-pink-600 transition-all transform hover:scale-105"
                            onClick={handleObjavi}
                        >
                            Objavi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;