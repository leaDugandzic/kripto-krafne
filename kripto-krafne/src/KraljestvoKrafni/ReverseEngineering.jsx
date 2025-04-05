import { useState } from 'react';

export default function ReverseEngineeringChallenge() {
  const [flag, setFlag] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const checkFlag = () => {
    const correctFlag = 'FLAG{secret_password}';
    setIsCorrect(flag === correctFlag);
  };

  const handleDownload = () => {
    const binaryBase64 = `
      UEsDBBQAAAAIAEh5NVUYnXj3FgAAABYAAAAIABwAZGVidWdtZVVUCQADj1bWY49W1mN1eAsA
      AQT1AQAABAAAAABzZWNyZXRfcGFzc3dvcmRQSwECFAMUAAAACABIeTVVGJ149xYAAAAWAAAA
      CAAYAAAAAAABAAAAtIEAAAAAZGVidWdtZVVUBQADj1bWY3V4CwABBPUBAAAEAAAAAFBLAQIU
      AxQAAAAIAEh5NVUYnXj3FgAAABYAAAAIABgAAAAAAAEAAAC0gQAAAABkZWJ1Z21lVVQFAAPP
      VtZjdXgLAAEE9QEAAAQAAAAAUEsFBgAAAAACAAIAwAAAANIAAAAAAA==
    `;

    const binaryData = atob(binaryBase64.trim());
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reverse_challenge.bin';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-pink-50 text-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">Reverse Engineering Challenge</h1>

      <div className="mb-6">
        <p className="mb-4">
          Preuzmite binarnu datoteku i analizirajte njezin sadržaj kako biste identificirali skriveni flag.
          Ovaj izazov zahtijeva pažnju i osnovno znanje rada s binarnim podacima.
        </p>
        <button 
          onClick={handleDownload}
          className="px-4 py-2 bg-pink-200 hover:bg-pink-300 rounded text-pink-800 transition-colors"
        >
          Preuzmi reverse_challenge.bin
        </button>
      </div>

      <div className="mb-6">
        <div className="bg-pink-100 p-4 rounded border border-pink-200 mb-4">
          <h3 className="font-mono text-pink-600 mb-2">Savjet:</h3>
          <p className="italic">"Ponekad najjednostavniji alati mogu otkriti najvažnije tragove."</p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Unesite flag u formatu FLAG{...}"
            className="flex-1 px-4 py-2 bg-white border border-pink-300 rounded focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={checkFlag}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white"
          >
            Provjeri
          </button>
        </div>

        {isCorrect !== null && (
          <div className={`mt-3 p-3 rounded border ${isCorrect ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
            {isCorrect
              ? 'Točno! Pronašli ste ispravan flag.'
              : 'Flag nije točan. Pokušajte ponovno ili detaljnije analizirajte datoteku.'}
          </div>
        )}
      </div>
    </div>
  );
}
