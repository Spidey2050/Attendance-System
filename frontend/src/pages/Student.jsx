import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import studentimg from "../assets/student.png";

export default function Student() {
  const navigate = useNavigate();
  const location = useLocation();
  const rollNo = location.state?.rollNo;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${studentimg})` }}
    >

      {/* NAVBAR */}
      <nav className="bg-slate-100 shadow-md px-8 py-4 flex items-center">

        <h1 className="text-xl font-bold text-blue-600">
          Student Panel
        </h1>

        <div className="flex gap-6 ml-10 text-slate-700 font-medium">

          <button
            onClick={() => navigate("/student/attendance")}
            className="hover:text-blue-600 transition"
          >
            Attendance
          </button>

          <button
            onClick={() => navigate("/student/notifications")}
            className="hover:text-blue-600 transition"
          >
            Notifications
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
          Welcome Back, {rollNo} 👋
        </h1>

        <p className="text-slate-600 mt-6 text-lg max-w-xl">
          Check your attendance records and stay updated with important
          announcements from your teachers. The student dashboard helps
          you monitor your academic activity quickly and easily.
        </p>

        <div className="flex gap-6 mt-10">

          <button
            onClick={() => navigate("/student/attendance")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View Attendance
          </button>

          <button
            onClick={() => navigate("/student/notifications")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View Notifications
          </button>

        </div>

      </div>

    </div>
  );
}