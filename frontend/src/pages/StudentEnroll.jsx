import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import facecapture from "../assets/facecapture.png";

export default function StudentEnroll() {
  const cam = useRef(null);
  const [count, setCount] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const navigate = useNavigate();
  const { rollNo } = useParams();

  const TOTAL = 30;

  const startCapture = async () => {
    if (capturing) return;

    setCapturing(true);

    let images = [];

    try {
      for (let i = 0; i < TOTAL; i++) {
        const img = cam.current.getScreenshot();
        const blob = await fetch(img).then((r) => r.blob());
        images.push(blob);

        setCount(i + 1);
        await new Promise((res) => setTimeout(res, 200));
      }

      const fd = new FormData();
      fd.append("rollNo", rollNo);
      images.forEach((img) => fd.append("images", img));

      await axios.post(
        "http://localhost:5000/api/student/enroll-face",
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Face enrolled");
      navigate("/admin");

    } catch (err) {
      alert("❌ Enrollment failed");
      console.error(err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between px-12 py-6 border-b border-slate-700">
        <button
          onClick={() => navigate("/admin")}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold tracking-wide">
          Face Enrollment
        </h1>

        <div></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-12 px-20 py-16 items-center">

        {/* LEFT SIDE */}
        <div>

          <img
            src={facecapture}
            alt="Face capture guide"
            className="w-[420px] mb-10 opacity-90"
          />

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Register Student Face
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Keep the student’s face inside the camera frame while the
            system captures multiple images. This helps train the AI
            recognition system and improves verification accuracy.
          </p>

          <p className="text-blue-400 mt-6 text-lg font-medium">
            Student Roll No: {rollNo}
          </p>

        </div>

        {/* VERTICAL DIVIDER */}
        <div className="h-[420px] w-px bg-slate-700/50"></div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-center">

          {/* CAMERA */}
          <div className="relative w-full max-w-md">

            <Webcam
              ref={cam}
              screenshotFormat="image/jpeg"
              className="rounded-xl w-full border border-slate-700"
            />

            {/* FACE SCAN FRAME */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-60 h-60 border-2 border-green-400 rounded-xl animate-pulse"></div>
            </div>

          </div>

          {/* CAPTURE STATUS */}
          <p className="text-slate-400 mt-6 mb-4 text-lg">
            {capturing
              ? `Capturing images... ${count}/${TOTAL}`
              : `Captured ${count}/${TOTAL}`}
          </p>

          {/* PROGRESS BAR */}
          <div className="w-full max-w-md bg-slate-700 rounded-full h-2 mb-8">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{
                width: `${(count / TOTAL) * 100}%`,
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={startCapture}
            disabled={capturing}
            className={`px-12 py-4 rounded-xl text-lg font-semibold transition shadow-lg
            ${
              capturing
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 hover:shadow-green-500/40"
            }`}
          >
            {capturing ? "Capturing..." : "Start Face Capture"}
          </button>

        </div>

      </div>

    </div>
  );
}