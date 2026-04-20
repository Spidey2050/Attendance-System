import Webcam from "react-webcam";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherVerify() {
  const cam = useRef(null);
  const navigate = useNavigate();

  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState("");
  const [verifiedList, setVerifiedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("Math");
  const [year, setYear] = useState("1st");
  const [section, setSection] = useState("A");

  const verifyStudent = async () => {
    if (loading) return;

    if (!cam.current) {
      setResult("❌ Camera not ready");
      return;
    }

    const img = cam.current.getScreenshot();

    if (!img) {
      setResult("❌ Camera frame not captured");
      return;
    }

    if (!rollNo.trim()) {
      setResult("❌ Enter roll number");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const blob = await fetch(img).then(r => r.blob());

      const fd = new FormData();
      fd.append("rollNo", rollNo);
      fd.append("image", blob);
      fd.append("subject", subject); 
      fd.append("year", year);
      fd.append("section", section);
      

      const res = await axios.post(
        "http://localhost:5000/api/teacher/verify-student",
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.match) {
        setResult("✅ Face Matched");

        setVerifiedList(prev =>
          prev.includes(rollNo) ? prev : [...prev, rollNo]
        );
      } else {
        setResult("❌ Face Not Matched");
      }

    } catch {
      setResult("❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* HEADER */}
      <div className="bg-slate-800 shadow-lg px-10 py-2 flex items-center">

        <button
          onClick={() => navigate("/teacher")}
          className="text-blue-400 hover:text-blue-300 mr-6"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">
          Student Verification
        </h1>

      </div>

      <div className="p-2 grid md:grid-cols-2 gap-5">

        {/* CAMERA SECTION */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-5 border border-slate-700">

          <h2 className="text-lg font-semibold mb-1 text-slate-200">
            Camera Capture
          </h2>

          <div className="border-2 border-slate-700 rounded-xl overflow-hidden mb-1">
            <Webcam
              ref={cam}
              screenshotFormat="image/jpeg"
              className="w-full "
            />
          </div>

          <input
            className="bg-slate-900 border border-slate-700 w-full p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            placeholder="Enter Student Roll Number"
            value={rollNo}
            onChange={e => setRollNo(e.target.value)}
          />
          <select
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 mb-4 text-white"
>
  <option>Math</option>
  <option>Physics</option>
  <option>Chemistry</option>
  <option>English</option>
  <option>Computer</option>
  <option>Biology</option>
</select>
           <select className="bg-slate-600 m-2" value={year} onChange={(e) => setYear(e.target.value)}>
  <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
</select>

<select className="bg-slate-600" value={section} onChange={(e) => setSection(e.target.value)}>
  <option value="A">A</option>
  <option value="B">B</option>
  <option value="C">C</option>
</select>

          <button
            onClick={verifyStudent}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-600"
                : "bg-blue-600 hover:bg-blue-500 shadow-lg hover:shadow-blue-500/40"
            }`}
          >
            {loading ? "Verifying..." : "Verify Student"}
          </button>

          {result && (
            <p className={`mt-4 text-center font-semibold ${
              result.includes("Matched")
                ? "text-green-400"
                : "text-red-400"
            }`}>
              {result}
            </p>
          )}
          <button className="w-full py-3 my-2 rounded-lg font-semibold transition bg-yellow-600 hover:bg-yellow-500 shadow-lg hover:shadow-blue-500/40"
  onClick={async () => {
    await axios.post(
      "http://localhost:5000/api/teacher/submit-attendance",
      {subject,
        year,        
        section },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("✅ Attendance submitted!");
  }}
>
  Submit Attendance
</button>

        </div>

        {/* VERIFIED LIST */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-7 border border-slate-700">

          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            Verified Students
          </h2>

          {verifiedList.length === 0 ? (
            <p className="text-slate-400">
              No students verified yet
            </p>
          ) : (
            <ul className="space-y-3">
              {verifiedList.map(r => (
                <li
                  key={r}
                  className="flex justify-between items-center bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg"
                >
                  <span>Roll No: {r}</span>
                  <span className="text-sm">✔ Verified</span>
                </li>
              ))}
            </ul>
          )}
          

        </div>
      
      </div>
      

    </div>
  );
}