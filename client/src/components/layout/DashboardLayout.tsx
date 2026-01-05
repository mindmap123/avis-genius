import { Sidebar } from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerAction?: React.ReactNode;
}

export function DashboardLayout({ children, headerTitle, headerAction }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Background gradient subtle */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
        
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-background/80 px-8 backdrop-blur-sm z-10 sticky top-0">
          <h1 className="text-2xl font-heading font-semibold text-foreground tracking-tight">
            {headerTitle || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            {headerAction}
          </div>
        </header>
        <ScrollArea className="flex-1">
          <main className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}