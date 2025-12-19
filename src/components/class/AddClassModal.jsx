import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandGroup, CommandItem, CommandInput } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check } from 'lucide-react'
import api from '../../utils/api'
import { createClass } from '@/api/classes'

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

export function AddClassModal({ open, onOpenChange, onSuccess }) {
    const [form, setForm] = useState({
        grade: '',
        section: '',
        campus: '',
        classTeacher: '',
        subjects: [],
    })

    const [campuses, setCampuses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [subjectsOpen, setSubjectsOpen] = useState(false)


    useEffect(() => {
        if (!open) return

        const fetchDropdowns = async () => {
            const [campusRes, teacherRes, subjectRes] = await Promise.all([
                api.get('/campuses'),
                api.get('/auth/users?role=teacher'),
                api.get('/subjects'),
            ])

            setCampuses(campusRes.campuses)
            setTeachers(teacherRes.users)
            setSubjects(subjectRes)
            console.log(subjectRes)
        }

        fetchDropdowns()
    }, [open])
    console.log("campus data: ", campuses, "teacher data: ", teachers, "subject data: ", subjects);

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const payload = {
                grade: Number(form.grade),
                section: form.section,
                campus: form.campus,
                classTeacher: form.classTeacher || undefined,
                subjects: form.subjects,
            }
            await createClass(payload)
            onSuccess?.()
            onOpenChange(false)
        } finally {
            setLoading(false)
        }
    }

    const toggleSubject = (id) => {
        setForm((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(id)
                ? prev.subjects.filter((s) => s !== id)
                : [...prev.subjects, id],
        }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>Add Class</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Grade</Label>
                        <Input
                            type="number"
                            value={form.grade}
                            onChange={(e) => setForm({ ...form, grade: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Section</Label>
                        <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {SECTIONS.map((s) => (
                                    <SelectItem key={s} value={s} className={"cursor-pointer hover:bg-gray-100"}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Campus</Label>
                        <Select value={form.campus} onValueChange={(v) => setForm({ ...form, campus: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select campus" />
                            </SelectTrigger>
                            <SelectContent className={"bg-white"}>
                                {campuses.map((c) => (
                                    <SelectItem key={c._id} value={c._id} className={"cursor-pointer hover:bg-gray-100"}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Subjects</Label>

                        <Select open={subjectsOpen} onOpenChange={setSubjectsOpen}>
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder="Select subjects"
                                >
                                    {form.subjects.length
                                        ? `${form.subjects.length} selected`
                                        : "Select subjects"}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent
                                position="popper"
                                side="top"              // ⬆️ OPEN UP
                                className="max-h-72 overflow-y-auto bg-white"
                            >
                                {subjects.map((s) => (
                                    <div
                                        key={s._id}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            toggleSubject(s._id)
                                        }}
                                        className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted"
                                    >
                                        <Check
                                            className={`h-4 w-4 ${form.subjects.includes(s._id)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                }`}
                                        />
                                        {s.name}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Class Teacher</Label>
                        <Select value={form.classTeacher} onValueChange={(v) => setForm({ ...form, classTeacher: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {teachers.map((t) => (
                                    <SelectItem key={t._id} value={t._id} className={"cursor-pointer hover:bg-gray-100"}>{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading} className="text-white">
                        {loading ? 'Saving...' : 'Create Class'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
