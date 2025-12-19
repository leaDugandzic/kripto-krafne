import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentsLayout from "./CommentsLayout";

const PostLayout = () => {
    const { postid } = useParams();
    const [post, setPost] = useState(null);
    const [ucitavaSe, setUcitavaSe] = useState(true);
    const [greska, setGreska] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        ucitajPost();
        ucitajKomentare();

    }, [postid]);

    const ucitajKomentare = async () => {
        try {
            const response = await fetch(
                `http://localhost/kripto-krafne/kripto-krafne/src/backend/getComments.php?post_id=${postid}`,
                {
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (data.success) {
                setComments(data.comments);
            }
        } catch (err) {
            console.error("Greška pri učitavanju komentara:", err);
        }
    };

    const handleObjavi = () => {
        if (!comment.trim()) {
            alert("Molimo popunite polje!");
            return;
        }
        let apiPost = "http://localhost/kripto-krafne/kripto-krafne/src/backend/comments.php";
        let data = {
            Komentar: comment,
            PostId: postid
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
                    setComment("");
                    ucitajKomentare();
                }
            });
    }
    const ucitajPost = async () => {
        try {
            setUcitavaSe(true);
            setGreska(null);

            const response = await fetch(`http://localhost/kripto-krafne/kripto-krafne/src/backend/getPost.php?post_id=${postid}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                setPost(data.post);
            } else {
                setGreska(data.message || "Post nije pronađen");
            }
        } catch (err) {
            console.error("Greška pri učitavanju posta:", err);
            setGreska("Došlo je do greške pri učitavanju posta");
        } finally {
            setUcitavaSe(false);
        }
    };

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

    if (greska) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Greška</h3>
                    <p className="text-gray-600 mb-4">{greska}</p>
                    <Link
                        to="/forums"
                        className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        ← Natrag na forum
                    </Link>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Post nije pronađen</h3>
                    <p className="text-gray-600 mb-4">Traženi post ne postoji ili je obrisan.</p>
                    <Link
                        to="/forums"
                        className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        ← Natrag na forum
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <Link
                    to="/forums"
                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                >
                    ← Natrag na forum
                </Link>
            </div>

            <article className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                            {post.category_name}
                        </span>
                        <span>•</span>
                        <span>Autor: {post.user_id}</span>
                        <span>•</span>
                        <span>{formatirajDatum(post.publish_date)}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>
                </div>

                <div className="p-6">
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {post.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4 sm:mb-0">
                            <button className="flex items-center space-x-1 hover:text-pink-500 transition-colors">
                                <span>❤️</span>
                                <span>Sviđa mi se</span>
                            </button>
                           

                        </div>


                    </div>
                </div>
            </article>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Komentari</h3>
                <textarea
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-vertical"
                    placeholder="Napišite sadržaj vašeg posta..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="bg-pink-500 text-white font-semibold px-5 py-2 rounded shadow-md hover:bg-pink-600 transition-all transform hover:scale-101"
                    onClick={handleObjavi}
                >
                    Objavi
                </button>

                {comments.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                        Još nema komentara. Budi prvi! 💬
                    </p>
                ) : (<div className="">
                    {comments.map((com) => (
                        <CommentsLayout
                            key={com.id}
                            com={com}
                        />
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default PostLayout;