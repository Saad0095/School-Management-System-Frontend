
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { getClasses } from '@/api/classes'
// import { AddClassModal } from '../../components/class/AddClassModal'

// const Class = () => {
//   const [classes, setClasses] = useState([])
//   const [open, setOpen] = useState(false)
//   const navigate = useNavigate()

//   const fetchClasses = async () => {
//     const res = await getClasses()
//     setClasses(res.data)
//   }

//   useEffect(() => {
//     fetchClasses()
//   }, [])

//   return (
//     <Card className="rounded-2xl shadow">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-xl">Classes</CardTitle>
//         <Button onClick={() => setOpen(true)}>Add Class</Button>
//       </CardHeader>

//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Grade</TableHead>
//               <TableHead>Section</TableHead>
//               <TableHead>Campus</TableHead>
//               <TableHead>Class Teacher</TableHead>
//               <TableHead>Subjects</TableHead>
//               <TableHead>Students</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {classes.map((c) => (
//               <TableRow
//                 key={c._id}
//                 className="cursor-pointer hover:bg-muted"
//                 onClick={() => navigate(`/admin/classes/${c._id}`)}
//               >
//                 <TableCell>{c.grade}</TableCell>
//                 <TableCell>{c.section}</TableCell>
//                 <TableCell>{c.campusName}</TableCell>
//                 <TableCell>{c.classTeacherName}</TableCell>
//                 <TableCell>{c.subjects}</TableCell>
//                 <TableCell>{c.studentsCount}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>

//       <AddClassModal
//         open={open}
//         onOpenChange={setOpen}
//         onSuccess={fetchClasses}
//       />
//     </Card>
//   )
// }

// export default Class

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import { AddClassModal } from "@/components/class/AddClassModal";


const Class = () => {
  const [classes, setClasses] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // PAGE STATE
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const limit = 10;

  // Sync URL when page changes
  useEffect(() => {
    setSearchParams({ page });
  }, [page]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/classes?page=${page}&limit=${limit}`);
      setClasses(res.data);
      setCount(res.count);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page changes
  useEffect(() => {
    fetchClasses();
  }, [page]);

  const handleNext = () => {
    if (page * limit < count) {
      setPage(page + 1);
    }
  };

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">Classes</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Class
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Grade</th>
              <th className="border px-2 py-1">Section</th>
              <th className="border px-2 py-1">Campus</th>
              <th className="border px-2 py-1">Teacher</th>
              <th className="border px-2 py-1">Subjects</th>
              <th className="border px-2 py-1">Students</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr
                key={c._id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/admin/classes/${c._id}`)}
              >
                <td className="border px-2 py-1">{c.grade}</td>
                <td className="border px-2 py-1">{c.section}</td>
                <td className="border px-2 py-1">{c.campusName}</td>
                <td className="border px-2 py-1">{c.classTeacherName}</td>
                <td className="border px-2 py-1">{c.subjects}</td>
                <td className="border px-2 py-1">{c.studentsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          disabled={page === 1}
          className={`cursor-pointer px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          &larr; Back
        </button>
        <button
          onClick={handleNext}
          disabled={page * limit >= count}
          className={`cursor-pointer px-4 py-2 rounded ${
            page * limit >= count
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          Next &rarr;
        </button>
      </div>

      <AddClassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={fetchClasses}
      />
    </div>
  );
};

export default Class;
