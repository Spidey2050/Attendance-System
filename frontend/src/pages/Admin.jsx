import { useState, useEffect } from "react";  
import axios from "axios";
import { useNavigate } from "react-router-dom";
import adminBg from '../assets/adminImg.png'; 

export default function Admin() {
  const subjects = ["Math", "Physics", "Chemistry", "English", "Computer", "Biology"];
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [subjectTeachers, setSubjectTeachers] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const navigate = useNavigate();

  
  const handleSelect = (subject, teacherId) => {
  setSubjectTeachers(prev => ({
    ...prev,
    [subject]: teacherId
  }));
};

  const createUser = async () => {
    setMessage("");
    if (!name || !rollNo || !password) {
      setMessage("⚠️ All fields are required");
      return;
    }
    if (role === "teacher" && selectedSubjects.length === 0) {
  setMessage("⚠️ Select at least one subject for teacher");
  return;
}
console.log("Sending subjects:", selectedSubjects);
if (role === "student" && (!year || !section)) {
  setMessage("⚠️ Select year and section");
  return;
}
    if (role === "student") {
  for (let sub of subjects) {
    if (!subjectTeachers[sub]) {
      setMessage(`⚠️ Select teacher for ${sub}`);
      return;
    }
  }
}

    

    try {
      await axios.post(
  "http://localhost:5000/api/admin/create-user",
  { 
    name, 
    rollNo, 
    password, 
    role,
    year,        
  section,
    subjectAssignments: subjects.map(sub => ({
    subject: sub,
    teacher: subjectTeachers[sub]
  })),
    subjects: selectedSubjects
  },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setMessage(`✅ ${role} created successfully!`);
      setName(""); setRollNo(""); setPassword("");

      if (role === "student") navigate(`/enroll/${rollNo}`);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to create user"));
    }
  };
  useEffect(() => {
  axios.get("http://localhost:5000/api/admin/teachers", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => setTeachers(res.data));
  }, []);
  console.log(teachers);

  return (
    <div
  className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
  style={{ backgroundImage: `url(${adminBg})` }}
>
      

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm ">
  <nav className="bg-slate-900/80 shadow-md px-8 py-4 flex items-center">
        <h1 className="text-xl font-bold text-blue-600">
          admin panel
        </h1>

 
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </nav></div>

  {/* Glass Card */}
  <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700 p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-3xl mt-20">

    <h2 className="text-3xl font-bold text-white text-center mb-2">
      Admin Dashboard
    </h2>

    <p className="text-slate-400 text-center mb-8">
      Create and manage users for the attendance system
    </p>

    <div className="grid grid-cols-2 gap-10 ">

      <input
        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Student / Teacher Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Roll Number / ID"
        value={rollNo}
        onChange={e => setRollNo(e.target.value)}
      />

      <input
        type="password"
        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select
        className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option className="text-black" value="student">Student</option>
        <option className="text-black" value="teacher">Teacher</option>
      </select>

      {role === "student" && (
  <>
    <select
      value={year}
      onChange={(e) => setYear(e.target.value)}
      className="w-full p-3 rounded bg-slate-800 text-white"
    >
      <option value="">Select Year</option>
      <option>1st</option>
      <option>2nd</option>
      <option>3rd</option>
      <option>4th</option>
    </select>

    <select
      value={section}
      onChange={(e) => setSection(e.target.value)}
      className="w-full p-3 rounded bg-slate-800 text-white"
    >
      <option value="">Select Section</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
  </>
)}

      {role === "student" && (
  <div className="space-y-3">
    {subjects.map(sub => (
      <div key={sub}>
        <label className="text-white">{sub}</label>

        <select
          onChange={(e) => handleSelect(sub, e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white"
        >
          <option value="">Select Teacher</option>

          {teachers
  .filter(t => t.subjects?.includes(sub))   // 🔥 FILTER
  .map(t => (
    <option key={t._id} value={t._id}>
      {t.name}
    </option>
))}
        </select>
      </div>
    ))}
  </div>
)}

{role === "teacher" && (
  <div>
    <label className="text-white">Assign Subjects</label>

    {subjects.map(sub => (
      <div key={sub}>
        <input
          type="checkbox"
          value={sub}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedSubjects([...selectedSubjects, sub]);
            } else {
              setSelectedSubjects(
                selectedSubjects.filter(s => s !== sub)
              );
            }
          }}
        />
        <span className="ml-2">{sub}</span>
      </div>
    ))}
  </div>
)}


      

    </div>

    <button
      onClick={createUser}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30"
    >
      Register User
    </button>

    {message && (
      <p className={`mt-5 text-center font-medium ${
        message.includes('✅')
          ? 'text-green-400'
          : 'text-red-400'
      }`}>
        {message}
      </p>
    )}

  </div>

</div>
  );
}