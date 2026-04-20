import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState } from "react";
import bgImage from '../assets/your-bg-file.png'; // Update with your background path

export default function Register() {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [status, setStatus] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async () => {
    if (!name || !rollNo) {
      alert("Please enter both Name and Roll Number");
      return;
    }

    setIsCapturing(true);
    setStatus("Processing face data...");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((r) => r.blob());

      const fd = new FormData();
      fd.append("name", name);
      fd.append("rollNo", rollNo);
      fd.append("image", blob);

      await axios.post("http://localhost:5000/api/auth/register", fd);
      
      setStatus("✅ Registration complete!");
      setName("");
      setRollNo("");
    } catch (err) {
      setStatus("❌ Registration failed. Try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6">
        
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-2">Face Enrollment</h3>
          <p className="text-white/70">Securely register your identity for attendance</p>
        </div>

        {/* Webcam Area */}
        <div className="relative group overflow-hidden rounded-2xl border-4 border-white/30 shadow-inner">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 border-2 border-dashed border-white/20 pointer-events-none"></div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20 transition"
          />

          <input
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:bg-white/20 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={capture}
          disabled={isCapturing}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 ${
            isCapturing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-lg"
          }`}
        >
          {isCapturing ? "Registering..." : "Capture & Register"}
        </button>

        {status && (
          <p className={`text-center text-sm font-medium ${status.startsWith('✅') ? 'text-green-300' : 'text-red-300'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}