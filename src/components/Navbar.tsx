import { Button } from "@/components/ui/button";
import { Train, User, LogOut } from "lucide-react";

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <Train className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">SeatJourneys</h1>
            <p className="text-xs text-muted-foreground">Book your perfect seat</p>
          </div>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="default">Sign In</Button>
        )}
      </div>
    </nav>
  );
};