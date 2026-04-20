import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState } from "react";

export default function Verify() {
  const webcamRef = useRef(null);
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState("");

  const verify = async () => {
    if (!rollNo) {
      alert("Enter roll no");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(r => r.blob());

    const fd = new FormData();
    fd.append("rollNo", rollNo);
    fd.append("image", blob);

    setResult("Verifying...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify",
        fd
      );

      setResult(
        res.data.match
          ? `✅ Verified (distance ${res.data.distance.toFixed(3)})`
          : `❌ Not matched (distance ${res.data.distance.toFixed(3)})`
      );
    } catch (err) {
      setResult("❌ Verification failed");
    }
  };

  return (
    <>
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">

      {/* Title */}
      <h3 className="text-2xl font-bold text-center text-gray-800">
        Face Verification
      </h3>

      {/* Roll No input */}
      <input
        placeholder="Roll No"
        onChange={e => setRollNo(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg outline-none
                   border-gray-300 focus:border-blue-500
                   focus:ring-2 focus:ring-blue-200"
      />

      {/* Webcam */}
      <div className="flex justify-center">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={280}
          className="rounded-lg border shadow"
        />
      </div>

      {/* Verify button */}
      <button
        onClick={verify}
        className="w-full cursor-pointer bg-green-500 hover:bg-green-600
                   text-white font-semibold px-4 py-3 rounded-lg
                   transition duration-200"
      >
        Verify Face
      </button>

      {/* Result */}
      {result && (
        <p className="text-center text-sm font-medium text-gray-700">
          {result}
        </p>
      )}
    </div>
  </div>
</>

  );
}
