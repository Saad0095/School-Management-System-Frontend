import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// API Needed to get students
const AddScores = () => {
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await api.get("/exams", { params: { page: 1, limit: 100 } });
        setExamData(res?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load exam data");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  // ✅ Class selected → update subjects
  const handleClassChange = (value) => {
    setSelectedClass(value);
    setSelectedSubject("");
    setSelectedExamType("");
    setStudents([]);
    const foundClass = examData.find((c) => c.class === value);
    setSubjects(foundClass ? foundClass.subjects : []);
  };

  // ✅ Subject selected → update exam types
  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setSelectedExamType("");
    setStudents([]);
    const foundSubject = subjects.find((s) => s.subject === value);
    setExamTypes(foundSubject ? foundSubject.exams : []);
  };

  // ✅ Exam type selected → fetch students for that class
  const handleExamTypeChange = async (value) => {
    setSelectedExamType(value);
    setStudents([]);
    try {
      // Replace with your API endpoint for fetching students of a class
      const res = await api.get("/students", { params: { class: selectedClass } });
      // Add a 'marks' field for input
      const studentList = (res?.data || []).map((s) => ({ ...s, marks: "" }));
      setStudents(studentList);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    }
  };

  // ✅ Handle marks input change
  const handleMarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === studentId ? { ...s, marks: value } : s))
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Add Scores</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Select Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={handleClassChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {examData.map((cls) => (
                        <SelectItem key={cls.class} value={cls.class}>
                          {cls.class}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={handleSubjectChange}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s.subject} value={s.subject}>
                          {s.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Examination Type</Label>
                  <Select
                    value={selectedExamType}
                    onValueChange={handleExamTypeChange}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam, i) => (
                        <SelectItem key={i} value={exam.type}>
                          {exam.type} ({exam.totalMarks} Marks)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Students input */}
              {students.length > 0 && (
                <div className="space-y-3 max-h-[60vh] overflow-auto">
                  <h2 className="text-lg font-semibold mb-2">Enter Marks:</h2>
                  {students.map((s) => (
                    <div key={s._id} className="flex items-center gap-4">
                      <span className="w-1/3">{s.name}</span>
                      <Input
                        type="number"
                        value={s.marks}
                        onChange={(e) => handleMarksChange(s._id, e.target.value)}
                        placeholder="Enter Marks"
                        className="w-1/4"
                        min={0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddScores;
