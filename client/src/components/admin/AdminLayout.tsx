import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Building2,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Activity,
  ChevronLeft,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/establishments", icon: Building2, label: "Établissements" },
  { href: "/admin/ai-config", icon: Bot, label: "Config IA" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/system", icon: Activity, label: "Système" },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="font-bold text-lg">Avis-Genius</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link href="/dashboard">
            <a className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Retour au Dashboard
            </a>
          </Link>
          
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-amber-500 text-slate-900 text-xs font-bold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-slate-800 px-8 py-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-slate-400 mt-1">{description}</p>
          )}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
