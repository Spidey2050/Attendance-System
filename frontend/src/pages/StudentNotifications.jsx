import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function StudentNotifications() {
  const [data, setData] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    axios.get(
      "http://localhost:5000/api/student/notifications",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    .then(res => setData(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  text-white p-6">
      <div className="bg-slate-800 shadow-lg px-10 py-5 flex items-center ">

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

      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6 text-center mt-10">
         🔔 Notification list
      </h2>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <p className="text-center text-slate-400">
          No notifications yet
        </p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">

          {data.map(n => (
            <div
              key={n._id}
              className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 p-5 rounded-2xl shadow-lg hover:scale-[1.02] transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-blue-400">
                  {n.senderName || "Teacher"}
                </p>

                <span className="text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {/* MESSAGE */}
              <p className="text-slate-200 leading-relaxed">
                {n.message}
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}