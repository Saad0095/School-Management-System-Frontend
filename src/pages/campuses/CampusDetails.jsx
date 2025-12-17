import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import api from "../../utils/api";
import { DataTable } from "../../components/ui/DataTable";
import { MoveLeft, Pencil, Trash2 } from "lucide-react";
import EditCampusModal from "./EditCampusModal";


const CampusDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campus, setCampus] = useState(null);

    useEffect(() => {
        const fetchCampus = async () => {
            try {
                const res = await api.get(`/campuses/${id}`);
                setCampus(res);
                console.log(res)
            } catch (err) {
                console.error("Error fetching campus details:", err);
            }
        };
        fetchCampus();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this campus?")) return;
        try {
            await api.post(`/campuse/${id}/delete`);
            alert("Campus deleted successfully");
            navigate("/admin/campuses");
        } catch (err) {
            console.error("Failed to delete:", err);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/campuses/${id}/edit`);
    };

    if (!campus) return <p>Loading...</p>;

    const classColumns = [
        { header: "Class Name", accessorKey: "className" },
        { header: "Teacher", accessorKey: "classTeacher.name" },
        { header: "Students", accessorKey: "studentCount" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => navigate(-1)}><MoveLeft size={12}/> Back</Button>
                <h1 className="text-3xl font-bold">{campus.name}</h1>
                <div className="flex gap-2">
                    <EditCampusModal
                        campus={campus}
                        onUpdated={() => {
                            // refetch the updated campus
                            api.get(`/campuses/${id}`).then((res) => setCampus(res.data));
                        }}
                    />
                    <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>

            </div>

            <Card>
                <CardHeader><CardTitle>Campus Info</CardTitle></CardHeader>
                <CardContent>
                    <p><strong>City:</strong> {campus.city}</p>
                    <p><strong>Admin:</strong> {campus.campusAdmin?.name} ({campus.campusAdmin?.email})</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Classes</CardTitle></CardHeader>
                <CardContent>
                    <DataTable data={campus.classes || []} columns={classColumns} pageSize={5} />
                </CardContent>
            </Card>
        </div>
    );
};

export default CampusDetails;
