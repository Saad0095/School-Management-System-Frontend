import { useEffect, useState } from "react";
import { Building2, Users2, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import api from "../../utils/api";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card
    className="shadow-sm hover:shadow-md transition-shadow border-l-4"
    style={{ borderColor: color }}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl font-bold text-gray-900">{label}</CardTitle>
      <div className="p-2 rounded-md bg-muted">
        <Icon size={22} className="text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold text-gray-700">{value}</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    campusCount: 0,
    studentCount: 0,
    teacherCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/getOverview");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Total Campuses"
          value={stats.campusCount}
          color="#3b82f6" 
        />
        <StatCard
          icon={Users2}
          label="Total Students"
          value={stats.studentCount}
          color="#22c55e" // green-500
        />
        <StatCard
          icon={GraduationCap}
          label="Total Teachers"
          value={stats.teacherCount}
          color="#f59e0b" 
        />
      </div>

      {/* <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No recent activity to display.
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AdminDashboard;
