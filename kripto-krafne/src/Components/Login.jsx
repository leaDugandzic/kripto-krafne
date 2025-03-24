import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

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
                        placeholder="E-mail"
                        className="w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                    />
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full p-3 rounded-md border border-gray-300 mb-4 focus:outline-none bg-white"
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-4 text-center">or continue with</p>
                    <button className="flex items-center justify-center gap-2 bg-white w-[200px] px-4 py-2 rounded-md shadow mt-3 border border-gray-300 hover:bg-gray-100">
                        <FcGoogle size={20} /> Google
                    </button>
                    <button className="mt-2 bg-white w-[200px] px-4 py-2 rounded-md shadow border border-gray-300 hover:bg-gray-100">
                        AAI@EduHr
                    </button>
                    <button className="w-full bg-purple-500 text-white py-3 rounded-md mt-4 font-semibold hover:bg-purple-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
