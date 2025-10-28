import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Super Admin Routes */}
          <Route index element={<SuperAdminDashboard />} />
          <Route path="campuses" element={<div>Campuses</div>} />
          <Route path="users" element={<div>Users</div>} />

          {/* Campus Admin Routes */}
          {/* <Route index element={<CampusAdminDashboard /> /> */}
          <Route path="teachers" element={<div>Teachers</div>} />
          <Route path="students" element={<div>Students</div>} />
          <Route path="classes" element={<div>Classes</div>} />
          <Route path="subjects" element={<div>Subjects</div>} />

          {/* Teacher Routes */}
          <Route path="attendance" element={<div>Attendance</div>} />
          <Route path="exams" element={<div>Exams</div>} />
          <Route path="marks" element={<div>Marks</div>} />

          {/* Student Routes */}
          <Route path="my-attendance" element={<div>My Attendance</div>} />
          <Route path="my-marksheets" element={<div>My Marksheets</div>} />
          <Route path="ai-recommendations" element={<div>AI Study Recommendations</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
