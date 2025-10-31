import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ime, setIme] = useState("");

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSumbit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        let apiSignup = "http://localhost/kripto-krafne/kripto-krafne/src/backend/signup.php";
        let headers={
            "Accept": "application/json",
            "Content-Type":"application/json"
        }

        let data ={
            Ime: ime,
            Password: password,
            Email:email
        }

        fetch(apiSignup,{
            method:"POST",
            headers:headers,
            body:JSON.stringify(data)
        })
        .then(async response => {
    const text = await response.text(); // always read as text first
    try {
        const json = JSON.parse(text);
        return json;
    } catch (e) {
        console.error("Backend returned non-JSON:", text);
        throw new Error("Invalid JSON response from backend");
    }
})
        .then((data)=>{
            if(data.success){
                alert("Signup successful!");
            }
            else{
                  alert( "Signup failed!");
            }
        })

    }

    return (

        <div className="flex items-center justify-center mt-25">
            <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center w-[500px]">
                <h2 className="text-3xl font-bold text-pink-500 text-center title-font">Prijavi se</h2>
                <div className="bg-beige p-8 rounded-xl w-full flex flex-col ">
                    <h4 className="float-left ">Unesites korisničko ime:</h4>
                    <input
                        type="ime"
                        value={ime}
                        onChange={(e) => setIme(e.target.value)}
                        className="text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                        />
                    <h4 className="float-left">Unesite e-mail:</h4>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                    />
                    <h4 className="float-left">Unesite lozinku:</h4>

                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                  

                    <button onClick={handleSumbit} className="w-full bg-pink-300 text-white py-3 rounded-md mt-4 font-semibold hover:bg-purple-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>

    );
}
