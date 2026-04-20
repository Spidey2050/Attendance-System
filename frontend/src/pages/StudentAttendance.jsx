import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

export default function StudentAttendance() {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/student/attendance", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      setData([
        { name: "Present", value: res.data.totalPresent },
        { name: "Absent", value: res.data.totalClasses - res.data.totalPresent }
      ]);

      setSubjects(res.data.subjectData);
    })
    .catch(err => console.error(err));
  }, []);

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  items-center p-6 text-white">

      <div className="bg-slate-800 shadow-lg px-10 py-5 flex items-center">

        <button
          onClick={() => navigate("/student")}
          className="text-blue-400 hover:text-blue-300 mr-6"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">
         Notifications
        </h1>
        

      </div>

          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  items-center py-10 text-white flex flex-col">



      {/* TITLE */}
      <h2 className="text-4xl font-bold mb-8 tracking-wide">
        📊 Attendance Dashboard
      </h2>

      {/* MAIN CARD */}
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8 w-full max-w-3xl flex flex-col items-center">

        {/* OVERALL */}
        <h3 className="mb-6 text-xl font-semibold text-blue-400">
          Overall Attendance
        </h3>

        <h1 className="text-5xl font-bold mb-6">
          {data.length && (data[0].value + data[1].value) > 0
            ? ((data[0].value / (data[0].value + data[1].value)) * 100).toFixed(1)
            : 0
          }%
        </h1>

        {/* PIE */}
        <PieChart width={320} height={320}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* PRESENT / ABSENT */}
        {data.length > 0 && (
          <div className="mt-6 flex gap-10 text-lg">
            <p className="text-green-400 font-semibold">
              ✔ Present: {data[0].value}
            </p>
            <p className="text-red-400 font-semibold">
              ✖ Absent: {data[1].value}
            </p>
          </div>
        )}
      </div>

      {/* SUBJECT SECTION */}
      {subjects.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">

          <h3 className="text-2xl font-semibold mb-4 text-center text-purple-400">
            📚 Subject-wise Performance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map(s => (
              <div
                key={s.subject}
                className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 p-4 rounded-xl flex justify-between items-center hover:scale-105 transition"
              >
                <span className="font-medium">{s.subject}</span>

                <span
                  className={`font-bold ${
                    s.percent >= 75
                      ? "text-green-400"
                      : s.percent >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {s.percent}%
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
    </div>
    
  );
}