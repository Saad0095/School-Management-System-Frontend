import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Check, ChevronsUpDown } from "lucide-react";

const AddCampus = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    campusAdmin: "",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const [users, assignedAdmins] = await Promise.all([
          api.get("/auth/users", { params: { role: "campus-admin" } }),
          api.get("/campuses/admins"),
        ]);
        const usersData = users.users
        const assignedSet = new Set(assignedAdmins.map(String));
        const unassignedAdmins = usersData.filter(
          (u) => !assignedSet.has(String(u._id))
        );
        // console.log("Unassigned Admins: ", unassignedAdmins, "users: ", users);

        setAdmins(unassignedAdmins);

        if (unassignedAdmins.length === 1) {
          setFormData((prev) => ({
            ...prev,
            campusAdmin: unassignedAdmins[0]._id,
          }));
        }
      } catch (error) {
        console.error("Failed to load campus admins", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/campuses", {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        city: formData.city,
        location: {
          type: "Point",
          coordinates: [
            Number(formData.longitude || 0),
            Number(formData.latitude || 0),
          ],
        },
        contact: {
          phone: formData.phone,
          email: formData.email,
        },
        campusAdmin: formData.campusAdmin,
      });

      // Redirect to campus list after success
      navigate("/admin/campuses");
    } catch (error) {
      console.error("Failed to create campus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Campus</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label>Campus Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Campus Code</Label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Address</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>City</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2">
                <Label>Latitude</Label>
                <Input
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Longitude</Label>
                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Campus Admin Dropdown */}
            <div className="flex flex-col gap-y-2">
              <Label>Campus Admin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={
                      !formData.campusAdmin
                        ? "text-muted-foreground justify-between"
                        : "justify-between"
                    }
                  >
                    {formData.campusAdmin
                      ? admins.find((a) => a._id === formData.campusAdmin)?.name
                      : "Select Campus Admin"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search campus admin..." />
                    <CommandEmpty>No admin found.</CommandEmpty>
                    <CommandGroup>
                      {admins.map((admin) => (
                        <CommandItem
                          key={admin._id}
                          onSelect={() =>
                            setFormData((prev) => ({
                              ...prev,
                              campusAdmin: admin._id,
                            }))
                          }
                        >
                          <Check
                            className={
                              formData.campusAdmin === admin._id
                                ? "mr-2 h-4 w-4 opacity-100"
                                : "mr-2 h-4 w-4 opacity-0"
                            }
                          />
                          {admin.name} ({admin.email})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              disabled={loading || !formData.campusAdmin}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Campus"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCampus;
