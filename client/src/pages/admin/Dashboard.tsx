import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoStats, demoActivityLogs, demoOrganizations, getUserName } from "@/lib/demo-data";
import { 
  Users, Building2, MessageSquare, Clock, TrendingUp, CheckCircle2, 
  AlertTriangle, Bell, Download, Plus, RefreshCw, Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "wouter";

export default function AdminDashboard() {
  const stats = demoStats;
  const logs = demoActivityLogs.slice(0, 10);

  const statCards = [
    { label: "Organisations", value: stats.totalOrganizations, icon: Briefcase, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Établissements", value: stats.totalEstablishments, icon: Building2, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Total Avis", value: stats.totalReviews, icon: MessageSquare, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "En Attente", value: stats.pendingReviews, icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10", badge: stats.urgentReviews > 0 ? `${stats.urgentReviews} urgents` : undefined },
    { label: "Réponses Publiées", value: stats.totalResponses, icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Taux de Réponse", value: `${stats.responseRate}%`, icon: TrendingUp, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return "🔐";
      case "review_responded": return "✅";
      case "ai_generated": return "🤖";
      case "settings_changed": return "⚙️";
      case "establishment_added": return "🏪";
      case "user_invited": return "👤";
      default: return "📝";
    }
  };

  return (
    <AdminLayout title="Dashboard Admin" description="Vue d'ensemble de la plateforme">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <Link href="/admin/organizations">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-1" /> Nouvelle Organisation
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            <RefreshCw className="h-4 w-4 mr-1" /> Sync GMB
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" className="relative text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.badge && (
                  <Badge className="bg-red-500/20 text-red-400 text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {stat.badge}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Log */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Activité Récente</CardTitle>
            <Link href="/admin/system">
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                Voir tout →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                <span className="text-lg">{getActivityIcon(log.activityType)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{log.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(log.createdAt), "dd MMM à HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Santé Système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-white">API Vercel</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">45ms</span>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-white">Database Neon</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">12ms</span>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-white">Gemini AI</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">125K/1M tokens</span>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-white">Google My Business</span>
              <Badge className="bg-amber-500/20 text-amber-500">
                <AlertTriangle className="h-3 w-3 mr-1" /> Config
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Organisations Actives</CardTitle>
            <Link href="/admin/organizations">
              <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400">
                Gérer →
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {demoOrganizations.map((org) => {
                const status = org.billing?.status || "trial";
                return (
                  <Link key={org.id} href={`/admin/organizations/${org.id}`}>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{org.name}</h4>
                        <Badge className={
                          status === "active" ? "bg-emerald-500/20 text-emerald-500" :
                          status === "trial" ? "bg-blue-500/20 text-blue-500" :
                          "bg-red-500/20 text-red-500"
                        }>
                          {status === "active" ? "Actif" : status === "trial" ? "Trial" : "Annulé"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-slate-400">
                          <span>Utilisateurs</span>
                          <span className="text-white">{org.usersCount} / {org.maxUsers}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Établissements</span>
                          <span className="text-white">{org.establishmentsCount} / {org.maxEstablishments}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Plan</span>
                          <span className="text-white">{org.billing?.planName || "Trial"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
