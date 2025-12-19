import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import StudentMarksheet from "./pages/marksheet/StudentMarksheet";
import AddScores from "./pages/exams/AddScores";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { Toaster } from "@/components/ui/sonner";
import Campus from "./pages/campuses/Campus";
import CampusDetails from "./pages/campuses/CampusDetails";
import AddCampus from "./pages/campuses/AddCampus";
import Class from "./pages/classes/Class";
import ClassDetails from "./pages/classes/ClassDetails";

const App = () => {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Super & Campus Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["super-admin", "campus-admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="campuses" element={<Campus/>} />
          <Route path="campuses/add" element={<AddCampus />} />
          <Route path="campuses/:id" element={<CampusDetails/>} />
          <Route path="users" element={<div>Users</div>} />
          <Route path="teachers" element={<div>Teachers</div>} />
          <Route path="students" element={<div>Students</div>} />
          <Route path="classes" element={<Class />} />
          <Route path="classes/:id" element={<ClassDetails />} />
          <Route path="subjects" element={<div>Subjects</div>} />
          <Route path="marksheets" element={<StudentMarksheet />} />
        </Route>

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<div>Attendance</div>} />
          <Route path="exams" element={<div>Exams</div>} />
          <Route path="marks" element={<AddScores/>} />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="my-attendance" element={<div>My Attendance</div>} />
          <Route path="my-marksheets" element={<StudentMarksheet />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
