import { useState, useEffect } from "react";

const Forums = () => {
    const [posts, setPosts] = useState([]);
    const [kategorije, setKategorije] = useState([]);
    const [odabranaKategorija, setOdabranaKategorija] = useState("sve");
    const [ucitavaSe, setUcitavaSe] = useState(true);

    useEffect(() => {
        ucitajPodatke();
    }, []);

    const ucitajPodatke = async () => {
        try {
            setUcitavaSe(true);
            
            const kategorijeRes = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getCategories.php", {
                method: "GET",
                credentials: "include",
            });
            const kategorijeData = await kategorijeRes.json();
            setKategorije(kategorijeData.categories || kategorijeData); 

            const postoviRes = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/getPosts.php", {
                method: "GET",
                credentials: "include",
            });
            const postoviData = await postoviRes.json();
            setPosts(postoviData.posts || postoviData); 

        } catch (err) {
            console.error("Greška pri učitavanju:", err);
        } finally {
            setUcitavaSe(false);
        }
    };

    const filtriraniPostovi = odabranaKategorija === "sve" 
        ? posts 
        : posts.filter(post => post.category_id == odabranaKategorija);

    const formatirajDatum = (datumString) => {
        const datum = new Date(datumString);
        return datum.toLocaleDateString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (ucitavaSe) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-pink-500 text-center title-font">KriptoKrafne Forum</h1>
                <p className="text-gray-600 mt-2">Raspravljajte s našom zajednicom!</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Kategorije</h2>
                        
                        <div className="space-y-2">
                            <button
                                onClick={() => setOdabranaKategorija("sve")}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                    odabranaKategorija === "sve" 
                                        ? "bg-pink-500 text-white" 
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                🗂️ Sve kategorije
                            </button>
                            
                            {kategorije.map((kategorija) => (
                                <button
                                    key={kategorija.id}
                                    onClick={() => setOdabranaKategorija(kategorija.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                        odabranaKategorija == kategorija.id
                                            ? "bg-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {kategorija.category_name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {odabranaKategorija === "sve" 
                                        ? "Svi postovi" 
                                        : kategorije.find(k => k.id == odabranaKategorija)?.category_name
                                    }
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Prikazano {filtriraniPostovi.length} od {posts.length} postova
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filtriraniPostovi.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nema postova</h3>
                                <p className="text-gray-600">
                                    {odabranaKategorija === "sve" 
                                        ? "Još nema objavljenih postova. Budite prvi!" 
                                        : "Nema postova u ovoj kategoriji."
                                    }
                                </p>
                            </div>
                        ) : (
                            filtriraniPostovi.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {post.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                        {post.category_name || "Nepoznato"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>Autor: {post.user_id || "Anoniman"}</span> 
                                                    <span>•</span>
                                                    <span>{formatirajDatum(post.publish_date)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="prose max-w-none mb-4">
                                            <p className="text-gray-700 leading-relaxed">
                                                {post.content}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <button className="flex items-center space-x-1 hover:text-pink-500 transition-colors">
                                                    <span>💬</span>
                                                    <span>Komentiraj</span>
                                                </button>
                                                <button className="flex items-center space-x-1 hover:text-pink-500 transition-colors">
                                                    <span>❤️</span>
                                                    <span>Sviđa mi se</span>
                                                </button>
                                            </div>
                                            <button className="text-pink-500 hover:text-pink-600 font-medium text-sm">
                                                Pročitaj više →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forums;