import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,signInWithPopup,  } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const firebaseConfig = {
      apiKey: "AIzaSyByUrAiofLLSbiUip7FgU2Dm56gj2amon4",
      authDomain: "kripto-krafne.firebaseapp.com",
      projectId: "kripto-krafne",
      storageBucket: "kripto-krafne.firebasestorage.app",
      messagingSenderId: "952913949861",
      appId: "1:952913949861:web:1b1bb619d7e12eaf28c94c"
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    

    const handleSumbit = (e) =>{
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
          }
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              
              const user = userCredential.user;
              console.log('User created:', user);
              navigate('/');
          })
          .catch((error) => {
            setError(error.message);
              
          });
    }
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            navigate('/');

          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
          });
      };
    

     
    return (
        
        <div className="flex items-center justify-center mt-10">
            <div className="bg-pink-300 p-10 rounded-3xl shadow-lg flex flex-col items-center w-[500px]">
                <h2 className="text-3xl font-bold text-700 text-center">Prijavi se</h2>
                <p className="text-pink-700 text-sm mt-2 text-center">
                    Kripto Krafne nezaboravno putovanje kroz svijet kibernetičke sigurnosti
                </p>
                <div className="bg-beige p-8 rounded-xl w-full flex flex-col items-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        placeholder="E-mail"
                        className="text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder="Password"
                            className=" text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                        {error}
                    </div>
                    <p className="text-gray-500 text-sm mt-4 text-center">or continue with</p>
                    <button onClick={handleGoogleSignIn} className="text-black flex items-center justify-center gap-2 bg-white w-[200px] px-4 py-2 rounded-md shadow mt-3 border border-gray-300 hover:bg-gray-100">
                        <FcGoogle size={20} /> Google
                    </button>
                    
                    <button onClick={handleSumbit} className="w-full bg-purple-500 text-white py-3 rounded-md mt-4 font-semibold hover:bg-purple-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>
        
    );
}
