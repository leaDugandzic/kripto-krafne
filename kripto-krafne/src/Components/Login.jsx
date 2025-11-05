import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const userInfo = jwt_decode(token);
    console.log("User info:", userInfo);

    try {
      const res = await fetch("http://localhost/kripto-krafne/kripto-krafne/src/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          credentials: "include",
        body: JSON.stringify({ token }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Backend returned non-JSON:", text);
        setError("Server returned invalid data");
        return;
      }

      if (data.success) {
        alert("Google login successful!");
        navigate("/");
      } else {
        setError(data.message || "Google login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network or server error");
    }
  };

    const handleSumbit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        let data = {
            Email: email,
            Password: password
        }
        let apiLogin = "http://localhost/kripto-krafne/kripto-krafne/src/backend/login.php";
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        fetch(apiLogin, {
            method: "POST",
            headers: headers,
              credentials: "include",
            body: JSON.stringify(data)
        })
            .then(async response => {
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    return json;
                } catch (e) {
                    console.error("Backend returned non-JSON:", text);
                    throw new Error("Invalid JSON response from backend");
                }

            })
            .then((data) => {
                if (data.success) {
                    alert("Login successful!");
                }
                else {
                    setMessage(data.message);
                }
            })
    }

    return (
        <div className="flex items-center justify-center mt-25">
            <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center w-[500px]">
                <h2 className="text-3xl font-bold text-pink-500 text-center title-font">Ulogiraj se</h2>
                <div className="bg-beige p-8 rounded-xl w-full flex flex-col items-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        className=" text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 text-black rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
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
                    <GoogleLogin onSuccess={handleGoogleSuccess} className="flex items-center text-black justify-center gap-2 bg-white w-[200px] px-4 py-2 rounded-md shadow mt-3 border border-gray-300 hover:bg-gray-100">
                    </GoogleLogin>

                    <button onClick={handleSumbit} className="w-full bg-purple-500 text-white py-3 rounded-md mt-4 font-semibold hover:bg-purple-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
