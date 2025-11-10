import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AddScores = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalExams, setTotalExams] = useState(0);
  const [selectedExam, setSelectedExam] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/exams", {
          params: { page, limit },
        });
        console.log(data);

        setExams(data?.exams || []);
        setTotalExams((data?.totalExams ?? data?.total) || 0);
        setPage(data?.page ?? page);
        setLimit(data?.limit ?? limit);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [page, limit]);

  const totalPages = Math.max(
    1,
    Math.ceil((totalExams || exams.length) / limit)
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Add Scores</h1>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Exams List</CardTitle>
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} — {totalExams} exams
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="rounded-md border max-h-[70vh] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-gray-100 z-10">
                  <TableRow>
                    <TableHead>Term</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={exam._id} className="hover:bg-gray-50">
                      <TableCell>{exam.term}</TableCell>
                      <TableCell>{exam.academicSession}</TableCell>
                      <TableCell>
                        {exam.class?.grade}-{exam.class?.section}
                      </TableCell>
                      <TableCell>{exam.subject?.name}</TableCell>
                      <TableCell>{exam.type}</TableCell>
                      <TableCell>{exam.totalMarks}</TableCell>
                      <TableCell>{exam.campus?.name}</TableCell>
                      <TableCell>
                        {new Date(exam.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => setSelectedExam(exam)}>
                          Add Scores
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {exams.length} of {totalExams || exams.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-600">Type</div>
                <div className="font-medium">{selectedExam.type}</div>
              </div>
              <div>
                <div className="text-gray-600">Term / Session</div>
                <div className="font-medium">
                  {selectedExam.term} / {selectedExam.academicSession}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Class</div>
                <div className="font-medium">
                  {selectedExam.class?.grade} {selectedExam.class?.section}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Subject</div>
                <div className="font-medium">{selectedExam.subject?.name}</div>
              </div>
              <div>
                <div className="text-gray-600">Campus</div>
                <div className="font-medium">{selectedExam.campus?.name}</div>
              </div>
              <div>
                <div className="text-gray-600">Total Marks</div>
                <div className="font-medium">{selectedExam.totalMarks}</div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Click "Load students" to fetch the student list for this
                class/exam and begin adding scores.
              </p>
              <div className="mt-3">
                <Button
                  size="sm"
                  onClick={() =>
                    alert(
                      "Next step: load students for this exam (not implemented)"
                    )
                  }
                >
                  Load students
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2"
                  onClick={() => setSelectedExam(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddScores;
