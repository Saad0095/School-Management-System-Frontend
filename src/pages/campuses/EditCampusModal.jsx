import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import api from "../../utils/api";

const EditCampusModal = ({ campus, onUpdated }) => {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: campus?.name || "",
      city: campus?.city || "",
      adminName: campus?.campusAdmin?.name || "",
      adminEmail: campus?.campusAdmin?.email || "",
    },
  });

  useEffect(() => {
    reset({
      name: campus?.name || "",
      city: campus?.city || "",
      adminName: campus?.campusAdmin?.name || "",
      adminEmail: campus?.campusAdmin?.email || "",
    });
  }, [campus, reset]);

  const onSubmit = async (values) => {
    try {
      await api.patch(`/campuses/${campus._id}`, {
        name: values.name,
        city: values.city,
        campusAdmin: {
          name: values.adminName,
          email: values.adminEmail,
        },
      });
      alert("Campus updated successfully");
      onUpdated?.();
      setOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update campus");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Campus</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium">Campus Name</label>
            <Input {...register("name")} placeholder="Enter campus name" required />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <Input {...register("city")} placeholder="Enter city" required />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Name</label>
            <Input {...register("adminName")} placeholder="Enter admin name" required />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Email</label>
            <Input {...register("adminEmail")} placeholder="Enter admin email" required />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampusModal;
