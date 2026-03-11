import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    // Helper function to decode JWT (you might need to install jwt-decode)
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error decoding JWT:', e);
            return null;
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const userInfo = decodeJWT(token);
        console.log("User info:", userInfo);

        try {
            const res = await fetch("http://localhost/backend/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token }),
            });

            const text = await res.text();
            console.log("Raw response:", text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Backend returned non-JSON:", text);
                setError("Server returned invalid data. Check console for details.");
                return;
            }

            if (data.success) {
                setMessage("Google login successful!");
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                setError(data.message || "Google login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network or server error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const data = {
            Email: email,
            Password: password
        };

        try {
            const response = await fetch("http://localhost/backend/login.php", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const text = await response.text();
            console.log("Raw response:", text);

            let jsonData;
            try {
                jsonData = JSON.parse(text);
            } catch (e) {
                console.error("Backend returned non-JSON:", text);
                setError("Server error - check console for details");
                return;
            }

            if (jsonData.success) {
                setMessage("Login successful!");
                setError('');
                // Give user a moment to see the success message
                setTimeout(() => {
                    // Use window.location to force a full page reload
                    // This will trigger the navbar's useEffect to check session
                    window.location.href = '/';
                }, 1000);
            } else {
                setError(jsonData.message || "Login failed");
            }
        } catch (err) {
            console.error("Network error:", err);
            setError("Network error - make sure XAMPP is running");
        }
    };

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
                        className="text-black w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-3 text-black rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm mb-2 text-center w-full">{error}</p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm mb-2 text-center w-full">{message}</p>
                    )}
                    
                    <p className="text-gray-500 text-sm mt-4 text-center">or continue with</p>
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google login failed")}
                        className="mt-3"
                    />

                    <button 
                        onClick={handleSubmit} 
                        className="w-full bg-purple-500 text-white py-3 rounded-md mt-4 font-semibold hover:bg-purple-600 transition-colors"
                    >
                        Submit
                    </button>
                    
                    <p className="text-gray-500 text-sm mt-4 text-center">
                        Don't have an account? <a href="/signup" className="text-purple-500 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}