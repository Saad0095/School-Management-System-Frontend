import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  TrendingUp,
  Save,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddScores = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [students, setStudents] = useState([]);
  const [examData, setExamData] = useState([]); // store full nested API response

  const [selectedClass, setSelectedClass] = useState(null); // will store object {_id, class}
  const [selectedSubject, setSelectedSubject] = useState(null); // will store object {_id, subject}
  const [selectedExamType, setSelectedExamType] = useState(null); // string
  const [selectedExamObj, setSelectedExamObj] = useState(null); // store chosen exam object
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/exams", {
          params: { page: 1, limit: 100 },
        });
        const payload = res?.data ?? [];
        console.log("exams payload:", payload);

        setExamData(payload);
        setClasses(payload);
      } catch (err) {
        console.error(err);
        setError("Failed to load exam data");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

  const handleClassChange = (clsId) => {
    const cls = classes.find((c) => c._id === clsId);
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedExamType(null);
    setStudents([]);
    setSubjects(cls?.subjects || []);
    setExamTypes([]);
  };

  const handleSubjectChange = (subjId) => {
    const subj = subjects.find((s) => s._id === subjId);
    setSelectedSubject(subj);
    setSelectedExamType(null);
    setStudents([]);
    setExamTypes(subj?.exams || []);
  };

 const handleExamTypeChange = async (examType) => {
  setSelectedExamType(examType);
  setStudents([]);
  if (!selectedClass || !selectedSubject) return;

  try {
    const res = await api.get("/score/examScores", {
      params: {
        classId: selectedClass._id,
        subjectId: selectedSubject._id,
        examType,
      },
    });

    console.log(res);
    const payload = res?.data ?? res;

    // Extract campusId from response
    const responseCampusId = payload?.campusId;

    const examObj =
      (selectedSubject?.exams || []).find((ex) => ex.type === examType) ||
      null;
    
    // Add campusId to examObj
    if (examObj && responseCampusId) {
      examObj.campusId = responseCampusId;
    }
    
    setSelectedExamObj(examObj);

    const studentList = (payload?.scores || payload?.students || []).map(
      (s) => ({
        ...s,
        marks: s.marks ?? 0,
      })
    );
    setStudents(studentList);
  } catch (err) {
    console.error(err);
    setError("Failed to load students");
  }
};

  const handleMarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student._id === studentId ? { ...s, marks: value } : s
      )
    );
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedSubject || !selectedExamObj) {
      setError("Please select class, subject, and exam type");
      return;
    }

    if (students.length === 0) {
      setError("No students to save");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        classId: selectedClass._id,
        subjectId: selectedSubject._id,
        campusId: selectedExamObj.campusId,
        examId: selectedExamObj._id,
        scores: students
          .filter((s) => s.marks > 0 || s.marks === 0)
          .map((s) => ({
            studentId: s.student._id,
            marksObtained: parseFloat(s.marks) || 0,
          })),
      };

      console.log("Sending payload:", payload);

      const res = await api.post("/score/addScore", payload);

      console.log("Response:", res);
      toast.success(
        `Successfully saved scores for ${res?.data?.count || students.length} students`
      );

      // Reset form
      setStudents([]);
      setSelectedExamType(null);
      setSelectedSubject(null);
      setSelectedClass(null);
      setSubjects([]);
      setExamTypes([]);
    } catch (error) {
      console.error("Save error:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save exam data";
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    if (students.length === 0) return 0;
    const filled = students.filter((s) => s.marks > 0).length;
    return Math.round((filled / students.length) * 100);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r  from-primary to-blue-600 bg-clip-text text-transparent">
              Add Exam Scores
            </h1>
            <p className="text-gray-600 mt-2">
              Record student performance with ease
            </p>
          </div>
          <div className="bg-white rounded-full p-4 shadow-lg">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Selection Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur py-0">
          <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="w-6 h-6" />
              Exam Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Class Select */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Class
                    </Label>
                    <Select
                      value={selectedClass?._id || ""}
                      onValueChange={handleClassChange}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject Select */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      Subject
                    </Label>
                    <Select
                      value={selectedSubject?._id || ""}
                      onValueChange={handleSubjectChange}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-400 transition-colors disabled:opacity-50">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exam Type Select */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText className="w-4 h-4 text-primary" />
                      Examination Type
                    </Label>
                    <Select
                      value={selectedExamType || ""}
                      onValueChange={handleExamTypeChange}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-primary transition-colors disabled:opacity-50">
                        <SelectValue placeholder="Select Exam Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((ex) => (
                          <SelectItem key={ex._id || ex.type} value={ex.type}>
                            {`${ex.type} (${ex.totalMarks ?? ex.totalMarks})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Info Banner */}
                {selectedClass && selectedSubject && selectedExamType && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          {students.length} Students Enrolled
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Max Marks:{" "}
                        <span className="font-bold text-blue-600">
                          {selectedExamObj?.totalMarks || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Students Marks Card */}
        {students.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur p-0">
            <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="w-6 h-6" />
                  Student Marks Entry
                </CardTitle>
                <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur">
                  <span className="text-sm font-semibold">
                    {getCompletionPercentage()}% Complete
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                {students.map((s, idx) => (
                  <div
                    key={s.student._id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-md">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">
                        {s.student.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={s.marks}
                        onChange={(e) =>
                          handleMarksChange(s.student._id, e.target.value)
                        }
                        placeholder="0"
                        className="w-24 h-12 text-center text-lg font-semibold border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        min={0}
                        max={selectedExamObj?.totalMarks ?? undefined}
                      />
                      <span className="text-gray-500 font-medium">
                        / {selectedExamObj?.totalMarks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="cursor-pointer bg-gradient-to-r  from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? "Saving..." : "Save All Scores"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading &&
          students.length === 0 &&
          selectedClass &&
          selectedSubject &&
          selectedExamType && (
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Students Found
                </h3>
                <p className="text-gray-500">
                  There are no students enrolled for this exam.
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
};

export default AddScores;
