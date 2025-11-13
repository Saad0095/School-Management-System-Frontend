import React, { useEffect, useState } from "react";
import { Brain, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import api from "@/utils/api";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        console.log("Getting Remarks...");
        
        const data = await api.get(`/ai/recommendation/${user?._id}`);
        console.log(data);
        setRecommendation(data.recommendation);
      } catch (error) {
        console.error("Failed to fetch AI remarks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchRemarks();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Welcome, {user?.name || "Student"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here are your latest AI-based study recommendations and insights.
        </p>
      </div>

      <Separator />

      {/* Static Data for now... */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Attendance Rate
            </CardTitle>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-800">92%</p>
            <p className="text-xs text-gray-400">Keep up the consistency!</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Marks
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-gray-800">84%</p>
            <p className="text-xs text-gray-400">Showing steady progress</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm animate-pulse">
              Loading recommendations...
            </p>
          ) : recommendation != "" ? (
            <p className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              {recommendation}
            </p>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No AI recommendations available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
