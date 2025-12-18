import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Users, UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { DataTable } from "../../components/ui/DataTable";
import api from "../../utils/api";

// Small card for stats
const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card
    className="shadow-sm hover:shadow-md transition-all border-l-4"
    style={{ borderColor: color }}
  >
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl font-semibold text-gray-900">
        {label}
      </CardTitle>
      <div className="p-2 rounded-md bg-muted">
        <Icon size={22} className="text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-gray-700">{value}</p>
    </CardContent>
  </Card>
);

const Campus = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalCampuses: 0,
    inActiveCampuses: 0,
  });

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/campuses");
        const resData = response.data || response; // handle axios/fetch shape

        setStats({
          totalCampuses: resData.totalCampuses || 0,
          inActiveCampuses: resData.inActiveCampuses || 0,
        });

        setData(resData.campuses || []);
      } catch (error) {
        console.error("Failed to fetch campuses:", error);
      }
    };

    fetchCampuses();
  }, []);

  // Define DataTable columns
  const columns = [
    {
      header: "Campus Name",
      accessorKey: "name",
      cell: (info) => (
        <button
          onClick={() =>
            navigate(`/admin/campuses/${info.row.original._id}`)
          }
          className="text-blue-600 hover:underline font-medium"
        >
          {info.getValue()}
        </button>
      ),
    },
    {
      header: "City",
      accessorKey: "city",
      cell: (info) => (
        <span className="flex items-center gap-1 text-gray-700">
          <MapPin size={14} />
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Admin",
      accessorKey: "campusAdmin.name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.campusAdmin?.name}</p>
          <p className="text-xs text-gray-500">
            {row.original.campusAdmin?.email}
          </p>
        </div>
      ),
    },
    { header: "Classes", accessorKey: "classCount" },
    { header: "Teachers", accessorKey: "teacherCount" },
    { header: "Students", accessorKey: "studentCount" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campus Overview</h1>
        <p className="text-gray-500">
          View, manage, and navigate to campus details.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Total Campuses"
          value={stats.totalCampuses}
          color="#3b82f6"
        />
        <StatCard
          icon={UserCog}
          label="Inactive Campuses"
          value={stats.inActiveCampuses}
          color="#ef4444"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={data.reduce((sum, c) => sum + (c.studentCount || 0), 0)}
          color="#10b981"
        />
        <StatCard
          icon={UserCog}
          label="Total Teachers"
          value={data.reduce((sum, c) => sum + (c.teacherCount || 0), 0)}
          color="#f59e0b"
        />
      </div>

      {/* Campus Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Campus List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} pageSize={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Campus;
