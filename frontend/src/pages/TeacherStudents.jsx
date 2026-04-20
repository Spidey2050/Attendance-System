import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("Math");
  const [year, setYear] = useState("1st");
  const [section, setSection] = useState("A");
  const navigate = useNavigate();

  useEffect(() => {
  axios.get(
  `http://localhost:5000/api/teacher/students?subject=${subject}&year=${year}&section=${section}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => setStudents(res.data))
  .catch(err => console.error(err));
  }, [subject, year, section]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* HEADER */}
      <div className="bg-slate-800 shadow-lg px-10 py-5 flex items-center">

        <button
          onClick={() => navigate("/teacher")}
          className="text-blue-400 hover:text-blue-300 mr-6"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold">
          Student List
        </h1>
        

      </div>

      <div className="p-10">

        {/* TABLE CARD */}
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200 mb-3">
              Registered Students
            </h2>
            <div className="mb-6">
  <select
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    className="p-2 bg-slate-700 text-white rounded mr-3"
  >
    <option>Math</option>
    <option>Physics</option>
    <option>Chemistry</option>
    <option>English</option>
    <option>Computer</option>
    <option>Biology</option>
  </select>
  <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
  className="p-2 bg-slate-700 text-white rounded mr-3"
>
  <option>1st</option>
  <option>2nd</option>
  <option>3rd</option>
  <option>4th</option>
</select>

<select
  value={section}
  onChange={(e) => setSection(e.target.value)}
  className="p-2 bg-slate-700 text-white rounded "
>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
</div>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No students found
            </div>
          ) : (
            <table className="w-full">

              <thead>
                <tr className="bg-slate-700 text-slate-200 text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Roll Number</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s, index) => (
                  <tr
                    key={s._id}
                    className={`border-t border-slate-700 hover:bg-slate-700/40 transition ${
                      index % 2 === 0 ? "bg-slate-800" : "bg-slate-800/70"
                    }`}
                  >
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-slate-300">{s.rollNo}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}