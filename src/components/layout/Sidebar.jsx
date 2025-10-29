import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Building,
  GraduationCap,
  Calendar,
  FileText,
  Brain,
  BarChart,
  Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const menuItems = {
  "super-admin": [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { label: "Campuses", icon: Building, path: "/admin/campuses" },
    { label: "Users", icon: Users, path: "/admin/users" },
    // { label: "Reports", icon: BarChart, path: "/admin/dashboard/reports" },
  ],
  "campus-admin": [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { label: "Teachers", icon: Users, path: "/admin/teachers" },
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Classes", icon: Calendar, path: "/admin/classes" },
    { label: "Subjects", icon: FileText, path: "/admin/subjects" },
  ],
  "teacher": [
    // { label: "Dashboard", icon: Home, path: "/teacher/dashboard" },
    { label: "Attendance", icon: Calendar, path: "/teacher/attendance" },
    { label: "Exams", icon: FileText, path: "/teacher/exams" },
    { label: "Marks", icon: GraduationCap, path: "/teacher/marks" },
  ],
  "student": [
    // { label: "Dashboard", icon: Home, path: "/student/dashboard" },
    { label: "Attendance", icon: Calendar, path: "/student/dashboard/my-attendance" },
    { label: "Marksheets", icon: FileText, path: "/student/dashboard/my-marksheets" },
    {
      label: "AI Recommendations",
      icon: Brain,
      path: "/student/ai-recommendations",
    },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role.toLowerCase() || "student";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col shadow-lg">
      <div className="px-6 py-5 border-b border-gray-300">
        <h1 className="text-lg font-semibold tracking-wide">
          School Management
        </h1>
        <p className="text-xs text-white/70 capitalize mt-1">
          {role} panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {menuItems[role]?.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-primary"
                      : "text-white/90 hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className="bg-gray-300" />

      <div className="px-6 py-3 text-xs text-gray-300">
        <p>© {new Date().getFullYear()} School Management System</p>
      </div>
    </aside>
  );
};

export default Sidebar;
