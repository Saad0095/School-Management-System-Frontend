import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getClassById } from '@/api/classes'
import { Button } from '@/components/ui/button'

const ClassDetails = () => {
  const { id } = useParams()
  const [cls, setCls] = useState(null)

  useEffect(() => {
    getClassById(id).then((res) => setCls(res.data))
  }, [id])

  if (!cls) return null

  return (
    <div className="space-y-6">
        <Button variant="link" href="/admin/classes" onClick={() => window.history.back()}> &larr; Back to Classes</Button>
      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>
            Class {cls.grade}-{cls.section}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Campus:</strong> {cls.campus.name}</p>
          <p><strong>Teacher:</strong> {cls.classTeacher.name}</p>
          <div className="flex gap-2 flex-wrap">
            {cls.subjects.map((s) => (
              <Badge key={s._id}>{s.name}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cls.students.map((st) => (
                <TableRow key={st._id}>
                  <TableCell>{st.name}</TableCell>
                  <TableCell>{st.rollNumber}</TableCell>
                  <TableCell>{st.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClassDetails
