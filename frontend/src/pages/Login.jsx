  import { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import bgImage from "../assets/Gemini_Generated_Image_3i5umh3i5umh3i5u.png";

  export default function Login() {
    const [rollNo, setRollNo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { rollNo, password }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.user._id);
        console.log(res.data); 

        if (res.data.role === "admin") navigate("/admin");
        else if (res.data.role === "teacher") navigate("/teacher");
        else navigate("/student",{
          state:{rollNo}
        });
      } catch {
        setError("Invalid login");
      }
    };

    return (
      <div
        className="min-h-screen bg-cover bg-center flex"
        style={{ backgroundImage: `url(${bgImage})` }}
      >

        {/* LEFT SIDE TEXT */}
        <div className="w-1/2 flex items-center px-16">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-slate-900 leading-tight">
              Manage Your Attendance Easily....
            </h1>

            <p className="mt-6 text-lg text-slate-900">
              Track attendance, manage students and monitor classes efficiently
              with our smart attendance system.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN CARD */}
        <div className="w-1/2 flex items-center justify-center">

    <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96">

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Welcome Back !
      </h2>

      <p className="text-center text-slate-500 mt-2 mb-6">
        Login to access your attendance dashboard
      </p>

      {/* Roll Number */}
      <div className="mb-4">
        <label className="text-sm text-slate-600 font-medium">
          Roll Number
        </label>

        <input
          className="border mt-1 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your roll number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mb-2">
        <label className="text-sm text-slate-600 font-medium">
          Password
        </label>

        <input
          type="password"
          className="border mt-1 mb-6 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      

      {/* Login Button */}
      <button
        onClick={login}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-semibold transition duration-200"
      >
        Sign In
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm mt-4 text-center">
          {error}
        </p>
      )}

      {/* Footer */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Smart Attendance Management System
      </p>

    </div>

  </div>
      </div>
    );
  }