import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Heart, Menu, ShieldCheck, X, User, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", requiresAuth: true },
  { to: "/profile", label: "Health Profile", requiresAuth: true },
  { to: "/records", label: "Medical Records", requiresAuth: true },
  { to: "/qr", label: "QR Code", requiresAuth: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20">
            <Heart className="size-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">Swasthya</span>
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                <span className="font-medium">{user.full_name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <ShieldCheck className="size-4" /> Sign in
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-md border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container mx-auto grid gap-1 px-4 py-3">
            {user ? (
              <>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm">
                    <User className="size-4" />
                    <span className="font-medium">{user.full_name}</span>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}