import { useNavigate } from "react-router-dom";
import teacherimg from '../assets/teacher.png';
import { useState, useEffect } from "react";   // ✅ ADD
import axios from "axios";          // ✅ ADD

export default function Teacher() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [notifCount, setNotifCount] = useState(0);

const send = async () => {
  await axios.post(
    "http://localhost:5000/api/teacher/notify",
    { message: msg },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  alert("Sent!");
};
useEffect(() => {
  axios.get("http://localhost:5000/api/teacher/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => {
    const lastSeen = localStorage.getItem("lastSeenNotif");

    if (!lastSeen) {
      setNotifCount(res.data.length);
      return;
    }

    const newCount = res.data.filter(n =>
      new Date(n.createdAt) > new Date(lastSeen)
    ).length;

    setNotifCount(newCount);
  })
  .catch(err => console.error(err));
}, []);

  return (
    <div className="min-h-screen  " style={{ backgroundImage: `url(${teacherimg})` }}>

      {/* NAVBAR */}
      <nav className="bg-slate-100 shadow-md px-8 py-4 flex items-center">

        <h1 className="text-xl font-bold text-blue-600">
          Teacher Panel
        </h1>

        <div className="flex gap-6 ml-10 text-slate-700 font-medium">

          <button
            onClick={() => navigate("/teacher/verify")}
            className="hover:text-blue-600 transition"
          >
            Verify Student
          </button>

          <button
            onClick={() => navigate("/teacher/students")}
            className="hover:text-blue-600 transition"
          >
            View Students
          </button>

          <button
  onClick={() => navigate("/teacher/notifications")}
  className="relative hover:text-blue-600 transition"
>
  Notifications

  {notifCount > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {notifCount}
    </span>
  )}
</button>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </nav>

      {/* HERO SECTION */}
      <div className="flex flex-col justify-center h-[80vh] px-16">

        <h1 className="text-5xl font-bold text-slate-800 leading-tight">
          Welcome Back, Teacher 👋
        </h1>

        <p className="text-slate-600 mt-6 text-lg max-w-xl">
          Manage student attendance, verify students, and track classroom 
          activity easily from your teacher dashboard.  
          This system helps you monitor attendance efficiently and keep 
          records organized.
        </p>

        

      </div>

    </div>
  );
}