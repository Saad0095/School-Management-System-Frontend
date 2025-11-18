import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

const StudentMarksheet = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get("term") || "FirstTerm";
  const academicSession = searchParams.get("academicSession") || "2025-2026";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const studentId =
    searchParams.get("studentId") ||
    (user?.role === "student" ? user?.id : null);
  const classId =
    searchParams.get("classId") ||
    (user?.role === "teacher" ? user?.classId : null);

  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const printableRef = useRef();

  useEffect(() => {
    const fetchMarksheet = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/result/marksheet", {
          params: { term, academicSession, studentId, classId, page },
        });
        setResult(res);
        setSelected(res?.marksheets?.[0] || null);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to load marksheets");
      } finally {
        setLoading(false);
      }
    };

    fetchMarksheet();
  }, [term, academicSession, studentId, page]);

  const downloadZIP = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        term,
        academicSession,
        studentId,
        downloadZIP: "true",
      }).toString();
      const url = `${api.defaults.baseURL.replace(
        /\/$/,
        ""
      )}/result/marksheet?${params}`;

      const resp = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (!resp.ok) throw new Error("Download failed");
      const blob = await resp.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `marksheets-${
        studentId || "student"
      }-${term}-${academicSession}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed", err);
      setError("Failed to download ZIP");
    }
  };

  const goPage = (p) => {
    const next = new URLSearchParams(Object.fromEntries([...searchParams]));
    next.set("page", String(p));
    setSearchParams(next);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!result || !result.marksheets || result.marksheets.length === 0) {
    return (
      <div className="p-6">
        <div className="text-gray-600">No marksheets found.</div>
      </div>
    );
  }

  const ms = selected || result.marksheets[0];
  const student = ms.student || {};
  const cls = ms.class || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {user?.role === "student"
              ? "My Marksheet"
              : user?.role === "teacher"
              ? "Class Marksheets"
              : "Student Marksheets"}
          </h1>
          <p className="text-sm text-gray-600">
            {term} — {academicSession}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(user?.role === "admin" ||
            user?.role === "teacher" ||
            result?.marksheets?.length > 1) && (
            <Button onClick={downloadZIP}>Download ZIP</Button>
          )}
        </div>
      </div>

      {(user?.role === "admin" || user?.role === "teacher") && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Filter by Student:</label>
          <input
            type="text"
            placeholder="Student Name or ID"
            className="px-3 py-2 border rounded"
            value={searchParams.get("studentId") || ""}
            onChange={(e) => {
              const next = new URLSearchParams(
                Object.fromEntries([...searchParams])
              );
              if (e.target.value) {
                next.set("studentId", e.target.value);
              } else {
                next.delete("studentId");
              }
              setSearchParams(next);
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded border">
        <select
          value={term}
          onChange={(e) =>
            setSearchParams({
              ...Object.fromEntries(searchParams),
              term: e.target.value,
            })
          }
          className="px-3 py-2 border rounded"
        >
          <option value="FirstTerm">First Term</option>
          <option value="MidTerm">Mid Term</option>
          <option value="FinalTerm">Final Term</option>
        </select>

        <select
          value={academicSession}
          onChange={(e) =>
            setSearchParams({
              ...Object.fromEntries(searchParams),
              academicSession: e.target.value,
            })
          }
          className="px-3 py-2 border rounded"
        >
          <option value="2025-2026">2025 - 2026</option>
          <option value="2024-2025">2024 - 2025</option>
        </select>

        {/* Admin/Teacher Only: Class Filter */}
        {(user?.role === "admin" || user?.role === "teacher") && (
          <input
            type="text"
            placeholder="Class ID"
            className="px-3 py-2 border rounded"
            value={classId || ""}
            onChange={(e) => {
              const next = new URLSearchParams(
                Object.fromEntries([...searchParams])
              );
              if (e.target.value) next.set("classId", e.target.value);
              else next.delete("classId");
              setSearchParams(next);
            }}
          />
        )}

        {/* Admin/Teacher Only: Student Filter */}
        {(user?.role === "admin" || user?.role === "teacher") && (
          <input
            type="text"
            placeholder="Student ID"
            className="px-3 py-2 border rounded"
            value={studentId || ""}
            onChange={(e) => {
              const next = new URLSearchParams(
                Object.fromEntries([...searchParams])
              );
              if (e.target.value) next.set("studentId", e.target.value);
              else next.delete("studentId");
              setSearchParams(next);
            }}
          />
        )}

        <Button onClick={() => setSearchParams({})} variant="outline">
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Select marksheet:</label>
        <select
          value={ms._id}
          onChange={(e) =>
            setSelected(result.marksheets.find((m) => m._id === e.target.value))
          }
          className="px-3 py-2 border rounded"
        >
          {result.marksheets.map((m) => (
            <option key={m._id} value={m._id}>
              {m.student?.name} — {m.class?.grade} {m.class?.section} —{" "}
              {new Date(m.createdAt).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow" ref={printableRef}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              Class: {cls.grade} ({cls.section})
            </h2>
            <p className="text-sm text-gray-600">
              Term: {ms.term} • Session: {ms.academicSession}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              Name: <span className="font-medium">{student.name}</span>
            </p>
            <p className="text-sm">
              Email: <span className="font-medium">{student.email}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-3 border-b">Subject</th>
                <th className="py-2 px-3 border-b">Total Marks</th>
                <th className="py-2 px-3 border-b">Marks Obtained</th>
                <th className="py-2 px-3 border-b">Percentage</th>
                <th className="py-2 px-3 border-b">Grade</th>
              </tr>
            </thead>
            <tbody>
              {ms.subjects?.map((s, idx) => (
                <tr key={s._id || idx} className="odd:bg-gray-50">
                  <td className="py-2 px-3">{s.subject?.name}</td>
                  <td className="py-2 px-3">{s.totalMarks ?? "-"}</td>
                  <td className="py-2 px-3">{s.marksObtained ?? "-"}</td>
                  <td className="py-2 px-3">{s.percentage ?? "-"}%</td>
                  <td className="py-2 px-3">{s.grade ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
          <div>
            <p>
              Grand Obtained:{" "}
              <span className="font-semibold">{ms.grandObtained}</span>
            </p>
            <p>
              Grand Total:{" "}
              <span className="font-semibold">{ms.grandTotal}</span>
            </p>
            <p>
              Overall Percentage:{" "}
              <span className="font-semibold">{ms.overallPercentage}%</span>
            </p>
          </div>
          <div className="text-right">
            <p>
              Overall Grade:{" "}
              <span className="font-semibold">{ms.overallGrade}</span>
            </p>
            <p>
              Remarks: <span className="font-semibold">{ms.finalRemarks}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {result.page} of{" "}
          {Math.ceil((result.totalMarksheets || 0) / (result.limit || 10) || 1)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={result.page <= 1}
            onClick={() => goPage(result.page - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={
              result.page >=
              Math.ceil((result.totalMarksheets || 0) / (result.limit || 10))
            }
            onClick={() => goPage(result.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentMarksheet;
