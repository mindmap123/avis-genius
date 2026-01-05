import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Reviews from "@/pages/Reviews";
import Analytics from "@/pages/Analytics";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOrganizations from "@/pages/admin/Organizations";
import AdminOrganizationDetail from "@/pages/admin/OrganizationDetail";
import AdminOrganizationUsers from "@/pages/admin/OrganizationUsers";
import AdminEstablishments from "@/pages/admin/Establishments";
import AdminAiConfig from "@/pages/admin/AiConfig";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminSystem from "@/pages/admin/System";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/reviews">{() => <ProtectedRoute component={Reviews} />}</Route>
      <Route path="/analytics">{() => <ProtectedRoute component={Analytics} />}</Route>
      <Route path="/settings">{() => <ProtectedRoute component={Dashboard} />}</Route>
      {/* Admin routes */}
      <Route path="/admin">{() => <AdminRoute component={AdminDashboard} />}</Route>
      <Route path="/admin/organizations">{() => <AdminRoute component={AdminOrganizations} />}</Route>
      <Route path="/admin/organizations/:id">{() => <AdminRoute component={AdminOrganizationDetail} />}</Route>
      <Route path="/admin/organizations/:id/users">{() => <AdminRoute component={AdminOrganizationUsers} />}</Route>
      <Route path="/admin/establishments">{() => <AdminRoute component={AdminEstablishments} />}</Route>
      <Route path="/admin/ai-config">{() => <AdminRoute component={AdminAiConfig} />}</Route>
      <Route path="/admin/analytics">{() => <AdminRoute component={AdminAnalytics} />}</Route>
      <Route path="/admin/system">{() => <AdminRoute component={AdminSystem} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
