const DetailsSection = () => {
    return (
        <div className="bg-cream p-8 flex flex-col lg:flex-row gap-8 text-pink-700">
            <div className="lg:w-2/3">
                <h2 className="text-xl font-bold italic">Web sigurnost</h2>
                <h1 className="text-2xl font-bold italic">1) Sigurnost Autentifikacije i Sesija</h1>
                <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                </p>
            </div>
            <div className="lg:w-1/3">
                <iframe
                    className="w-full h-48 rounded-lg"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Video Player"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default DetailsSection