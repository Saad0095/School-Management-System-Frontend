import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Building,
  GraduationCap,
  Calendar,
  FileText,
  Brain,
  BarChart,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = {
  superadmin: [
    { label: 'Campuses', icon: Building, path: '/dashboard/campuses' },
    { label: 'Users', icon: Users, path: '/dashboard/users' },
    { label: 'Reports', icon: BarChart, path: '/dashboard/reports' },
  ],
  campusadmin: [
    { label: 'Teachers', icon: Users, path: '/dashboard/teachers' },
    { label: 'Students', icon: GraduationCap, path: '/dashboard/students' },
    { label: 'Classes', icon: Calendar, path: '/dashboard/classes' },
    { label: 'Subjects', icon: FileText, path: '/dashboard/subjects' },
  ],
  teacher: [
    { label: 'Attendance', icon: Calendar, path: '/dashboard/attendance' },
    { label: 'Exams', icon: FileText, path: '/dashboard/exams' },
    { label: 'Marks', icon: GraduationCap, path: '/dashboard/marks' },
  ],
  student: [
    { label: 'Attendance', icon: Calendar, path: '/dashboard/my-attendance' },
    { label: 'Marksheets', icon: FileText, path: '/dashboard/my-marksheets' },
    { label: 'AI Recommendations', icon: Brain, path: '/dashboard/ai-recommendations' },
  ],
};

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role.toLowerCase() || 'student';

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-xl font-bold">School Management</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems[role]?.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors \${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;