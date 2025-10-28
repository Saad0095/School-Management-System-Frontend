import { useEffect, useState } from 'react';
import { Building, Users, BookOpen } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, className }) => (
  <div className={`p-6 bg-white rounded-xl shadow-sm ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon size={24} className="text-blue-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    campusCount: 0,
    userCount: 0,
    classCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/super-admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Building}
          label="Total Campuses"
          value={stats.campusCount}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.userCount}
          className="border-l-4 border-green-500"
        />
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.classCount}
          className="border-l-4 border-purple-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Activity content will go here */}
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;