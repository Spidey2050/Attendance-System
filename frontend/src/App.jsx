import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Teacher from "./pages/Teacher";
import TeacherVerify from "./pages/TeacherVerify";
import TeacherStudents from "./pages/TeacherStudents";
import Student from "./pages/Student";
import StudentEnroll from "./pages/StudentEnroll";
import StudentNotifications from "./pages/StudentNotifications";
import StudentAttendance from "./pages/StudentAttendance";
import TeacherNotifications from "./pages/TeacherNotifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<Admin />} />

        {/* Teacher */}
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/teacher/verify" element={<TeacherVerify />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/notifications" element={<TeacherNotifications />} />

        {/* Student */}
        <Route path="/student" element={<Student />} />
        <Route path="/enroll/:rollNo" element={<StudentEnroll />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}
