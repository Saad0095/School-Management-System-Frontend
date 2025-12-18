import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Building,
  GraduationCap,
  Calendar,
  FileText,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const menuItems = {
  "super-admin": [
    { label: "Dashboard", icon: Home, path: "/admin/dashboard" },

    {
      label: "Campuses",
      icon: Building,
      children: [
        {
          label: "All Campuses",
          path: "/admin/campuses",
        },
        {
          label: "Add Campus",
          path: "/admin/campuses/add",
        },
      ],
    },
    { label: "Teachers", icon: Users, path: "/admin/teachers" },
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Classes", icon: Calendar, path: "/admin/classes" },

    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Marksheets", icon: FileText, path: "/admin/marksheets" },
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
  ],
};

const Sidebar = ({ isOpen = false, onClose = () => { } }) => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "student";

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const base =
    "fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col shadow-lg z-40 transform transition-transform duration-200";
  const mobileHidden = "-translate-x-full md:translate-x-0";
  const mobileVisible = "translate-x-0 md:translate-x-0";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`${base} ${isOpen ? mobileVisible : mobileHidden}`}
      >
        {/* Header */}
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
              className="md:hidden"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {menuItems[role]?.map((item) => {
              // 🔹 Menu with children
              if (item.children) {
                const isOpen = openMenus[item.label];

                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="flex items-center justify-between w-full px-4 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {isOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                  ? "bg-white text-primary"
                                  : "text-white/80 hover:bg-white/10"
                                }`
                              }
                              onClick={onClose}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // 🔹 Normal menu item
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? "bg-white text-primary"
                        : "text-white/90 hover:bg-white/10"
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator className="bg-gray-300" />

        <div className="px-6 py-3 text-xs text-gray-300">
          © {new Date().getFullYear()} School Management System
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
