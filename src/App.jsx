import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Super & Campus Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="campuses" element={<div>Campuses</div>} />
          <Route path="users" element={<div>Users</div>} />
          <Route path="teachers" element={<div>Teachers</div>} />
          <Route path="students" element={<div>Students</div>} />
          <Route path="classes" element={<div>Classes</div>} />
          <Route path="subjects" element={<div>Subjects</div>} />
        </Route>

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<div>Attendance</div>} />
          <Route path="exams" element={<div>Exams</div>} />
          <Route path="marks" element={<div>Marks</div>} />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="my-attendance" element={<div>My Attendance</div>} />
          <Route path="my-marksheets" element={<div>My Marksheets</div>} />
          <Route
            path="ai-recommendations"
            element={<div>AI Study Recommendations</div>}
          />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
