import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TeacherNotifications() {
const [message, setMessage] = useState("");
const [notifications, setNotifications] = useState([]);
const userId = localStorage.getItem("userId");  // 🔥 ADD HERE
const navigate = useNavigate();

// 🔥 GET ALL NOTIFICATIONS
useEffect(() => {
    localStorage.setItem("lastSeenNotif", new Date().toISOString());
fetchNotifications();
}, []);

const fetchNotifications = () => {
axios.get("http://localhost:5000/api/teacher/notifications", {
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`
}
})
.then(res => setNotifications(res.data))
.catch(err => console.error(err));
};

// 🔥 SEND NOTIFICATION
const sendNotification = async () => {
if (!message) return alert("Enter message");


await axios.post(
  "http://localhost:5000/api/teacher/notify",
  { message },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
);

setMessage("");
fetchNotifications(); // refresh


};

const deleteNotification = async (id) => {
  if (!window.confirm("Delete this notification?")) return;

  await axios.delete(
    `http://localhost:5000/api/teacher/notifications/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  fetchNotifications();
};

return ( <div className="min-h-screen bg-slate-900 text-white p-10">


  {/* HEADER */}
  <div className="flex items-center mb-6">
    <button onClick={() => navigate("/teacher")} className="mr-4 text-blue-400">
      ← Back
    </button>
    <h1 className="text-2xl font-bold">Notifications</h1>
  </div>

  {/* SEND BOX */}
<div className="mt-8 flex items-center gap-3 bg-slate-800/50 p-2 pl-4 rounded-2xl border border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
  <input
    value={message}
    onChange={e => setMessage(e.target.value)}
    placeholder="Write message..."
    className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm py-2"
  />

  <button
    onClick={sendNotification}
    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
  >
    Send
  </button>
</div>

  {/* LIST */}
  <div className="mt-5">
    {notifications.length === 0 ? (
      <p className="text-slate-400">No notifications</p>
    ) : (
      notifications.map(n => (
  <div
    key={n._id}
    className="bg-slate-800 p-4 rounded mb-2 flex justify-between items-center"
  >

    <div>
      <p>{n.message}</p>

      <p className="text-sm text-slate-400">
        By: {n.senderName}
      </p>

      <p className="text-xs text-slate-500">
        {new Date(n.createdAt).toLocaleString()}
      </p>
    </div>

    {/* 🔥 SHOW DELETE ONLY IF OWNER */}
    {n.senderId === userId && (
      <button
        onClick={() => deleteNotification(n._id)}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        🗑️
      </button>
    )}

  </div>
))
    )}
  </div>

</div>


);
}
