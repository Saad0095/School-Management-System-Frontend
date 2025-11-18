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
    { label: "Marksheets", icon: FileText, path: "/admin/marksheets" },

    // { label: "Reports", icon: BarChart, path: "/admin/dashboard/reports" },
  ],
  "campus-admin": [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { label: "Teachers", icon: Users, path: "/admin/teachers" },
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Classes", icon: Calendar, path: "/admin/classes" },
    { label: "Subjects", icon: FileText, path: "/admin/subjects" },
  ],
  teacher: [
    { label: "Dashboard", icon: Home, path: "/teacher/dashboard" },
    { label: "Attendance", icon: Calendar, path: "/teacher/attendance" },
    // { label: "Exams", icon: FileText, path: "/teacher/exams" },
    { label: "Marks", icon: GraduationCap, path: "/teacher/marks" },
  ],
  student: [
    { label: "Dashboard", icon: Home, path: "/student/dashboard" },
    { label: "Attendance", icon: Calendar, path: "/student/my-attendance" },
    { label: "Marksheets", icon: FileText, path: "/student/my-marksheets" },
    // {
    //   label: "AI Recommendations",
    //   icon: Brain,
    //   path: "/student/ai-recommendations",
    // },
  ],
};

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useAuth();
  const role = user?.role.toLowerCase() || "student";

  // classes: hidden/slide on mobile, always visible on md+
  const base =
    "fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col shadow-lg z-40 transform transition-transform duration-200";
  const mobileHidden = "-translate-x-full md:translate-x-0"; // hidden by default on mobile
  const mobileVisible = "translate-x-0 md:translate-x-0"; // shown when open on mobile

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        // keep sidebar fixed so it does not push main content down on md+
        className={`${base} ${
          isOpen ? mobileVisible : mobileHidden
        } md:translate-x-0`}
        aria-hidden={
          !isOpen && typeof window !== "undefined" && window.innerWidth < 768
        }
      >
        <div className="px-6 py-5 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-wide">
                School Management
              </h1>
              <p className="text-xs text-white/70 capitalize mt-1">
                {role} panel
              </p>
            </div>
            <button
              className="cursor-pointer md:hidden ml-2 text-white/90 p-1 rounded hover:bg-white/10"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
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
                  onClick={() => {
                    // close sidebar on mobile after navigation
                    if (onClose) onClose();
                  }}
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
    </>
  );
};

export default Sidebar;
