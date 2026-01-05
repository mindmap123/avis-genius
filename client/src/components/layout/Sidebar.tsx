import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Globe
} from "lucide-react";
import logoImage from "@assets/generated_images/minimalist_geometric_logo_icon_for_reputation_software.png";
import avatarImage from "@assets/generated_images/portrait_of_a_smiling_restaurant_owner.png";
import { useState } from "react";

const navigation = [
  { name: { fr: "Vue d'ensemble", en: "Overview" }, href: "/dashboard", icon: LayoutDashboard },
  { name: { fr: "Avis Clients", en: "Reviews" }, href: "/reviews", icon: MessageSquare },
  { name: { fr: "Analyses & ROI", en: "Analytics & ROI" }, href: "/analytics", icon: BarChart3 },
  { name: { fr: "Paramètres", en: "Settings" }, href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl z-20">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="h-8 w-8 rounded-lg object-contain bg-white p-1" 
        />
        <span className="text-xl font-heading font-bold tracking-tight text-white">
          ReputationAI
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                    isActive
                      ? "bg-sidebar-primary text-white shadow-md shadow-sidebar-primary/20 translate-x-1"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white hover:translate-x-1"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-white"
                    )}
                  />
                  {item.name[lang]}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/30 text-xs">
            <span className="text-sidebar-foreground/50 flex items-center gap-2">
              <Globe className="h-3 w-3" /> Language
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setLang("fr")}
                className={cn("px-1.5 py-0.5 rounded", lang === 'fr' ? "bg-sidebar-primary text-white" : "hover:bg-sidebar-accent")}
              >FR</button>
              <button 
                onClick={() => setLang("en")}
                className={cn("px-1.5 py-0.5 rounded", lang === 'en' ? "bg-sidebar-primary text-white" : "hover:bg-sidebar-accent")}
              >EN</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3 hover:bg-sidebar-accent transition-colors cursor-pointer group">
          <img
            src={avatarImage}
            alt="User"
            className="h-10 w-10 rounded-full border-2 border-sidebar-primary object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white group-hover:text-sidebar-primary-foreground transition-colors">
              Marc Dubois
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50">
              Le Petit Bistro
            </p>
          </div>
          <LogOut className="h-4 w-4 text-sidebar-foreground/50 hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}