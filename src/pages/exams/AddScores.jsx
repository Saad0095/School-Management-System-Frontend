import { useEffect, useState } from "react";
import api from "@/utils/api";
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

const AddScores = () => {
  const [loading, setLoading] = useState(true);
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
        const res = await api.get("/exams", { params: { page: 1, limit: 100 } });
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

  // Handle class selection
  const handleClassChange = (clsId) => {
    const cls = classes.find(c => c._id === clsId);
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedExamType(null);
    setStudents([]);
    setSubjects(cls?.subjects || []);
    setExamTypes([]);
  };

  // Handle subject selection
  const handleSubjectChange = (subjId) => {
    const subj = subjects.find(s => s._id === subjId);
    setSelectedSubject(subj);
    setSelectedExamType(null);
    setStudents([]);
    setExamTypes(subj?.exams || []);
  };

  // Handle exam type selection & fetch students
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

      // find the exam object from selectedSubject.exams that matches the type
      const examObj = (selectedSubject?.exams || []).find((ex) => ex.type === examType) || null;
      setSelectedExamObj(examObj);

      const studentList = (payload?.scores || payload?.students || []).map((s) => ({
        ...s,
        marks: s.marks ?? 0,
      }));
      setStudents(studentList);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    }
  };

  const handleMarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.student._id === studentId ? { ...s, marks: value } : s))
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Class Select */}
                <div>
                  <Label>Class</Label>
                  <Select
                    value={selectedClass?._id || ""}
                    onValueChange={handleClassChange}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label>Subject</Label>
                  <Select
                    value={selectedSubject?._id || ""}
                    onValueChange={handleSubjectChange}
                    disabled={!selectedClass}
                  >
                    <SelectTrigger>
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
                <div>
                  <Label>Examination Type</Label>
                  <Select
                    value={selectedExamType || ""}
                    onValueChange={handleExamTypeChange}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger>
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

              {/* Students Marks Input */}
              {students.length > 0 && (
                <div className="space-y-3 max-h-[60vh] overflow-auto">
                  <h2 className="text-lg font-semibold mb-2">Enter Marks:</h2>
                  {students.map((s) => (
                    <div key={s.student._id} className="flex items-center gap-4">
                      <span className="w-1/3">{s.student.name}</span>
                      <Input
                        type="number"
                        value={s.marks}
                        onChange={(e) =>
                          handleMarksChange(s.student._id, e.target.value)
                        }
                        placeholder="Enter Marks"
                        className="w-1/4"
                        min={0}
                        max={selectedExamObj?.totalMarks ?? undefined}
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
