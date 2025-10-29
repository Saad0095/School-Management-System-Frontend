import { useAuth } from "../../context/AuthContext";
import { LogOut, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onToggle = () => {} }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 right-0 h-16 md:w-[calc(100%-16rem)] bg-secondary shadow-sm z-20 border-b border-gray-200 w-full">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 mr-2 cursor-pointer"
            onClick={onToggle}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <h2 className="hidden md:block text-xl font-semibold text-gray-800">Welcome! {user?.name}</h2>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2 text-gray-700 hover:text-primary cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
