import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { demoActivityLogs, demoHealthChecks } from "@/lib/demo-data";
import { Activity, Database, Bot, Globe, Clock, CheckCircle2, AlertCircle, Zap, HardDrive } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminSystem() {
  const logs = demoActivityLogs;
  const health = demoHealthChecks;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login": return "🔐";
      case "review_responded": return "✅";
      case "ai_generated": return "🤖";
      case "settings_changed": return "⚙️";
      case "establishment_added": return "🏪";
      default: return "📝";
    }
  };

  const geminiUsagePercent = (health.gemini.tokensUsed / health.gemini.tokensLimit) * 100;

  return (
    <AdminLayout title="Système" description="Santé et logs de la plateforme">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health Checks Detailed */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              État des Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Vercel */}
            <div className="p-4 bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">API Vercel</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Latence</span>
                <span className="text-white">{health.api.latency}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Uptime</span>
                <span className="text-emerald-500">{health.api.uptime}%</span>
              </div>
            </div>

            {/* Database */}
            <div className="p-4 bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Database Neon</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Latence</span>
                <span className="text-white">{health.database.latency}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Connexions</span>
                <span className="text-white">{health.database.connections}/{health.database.maxConnections}</span>
              </div>
            </div>

            {/* Gemini AI */}
            <div className="p-4 bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Gemini AI</span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> OK
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Latence moyenne</span>
                <span className="text-white">{health.gemini.latency}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Requêtes aujourd'hui</span>
                <span className="text-white">{health.gemini.requestsToday}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tokens utilisés</span>
                  <span className="text-white">{(health.gemini.tokensUsed / 1000).toFixed(0)}K / {(health.gemini.tokensLimit / 1000000).toFixed(0)}M</span>
                </div>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Progress value={geminiUsagePercent} className="h-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{geminiUsagePercent.toFixed(1)}% du quota utilisé</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Google My Business */}
            <div className="p-4 bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Google My Business</span>
                </div>
                <Badge className="bg-amber-500/20 text-amber-500">
                  <AlertCircle className="h-3 w-3 mr-1" /> Config
                </Badge>
              </div>
              <p className="text-sm text-slate-400">{health.googleMyBusiness.message}</p>
            </div>
          </CardContent>
        </Card>


        {/* Activity Logs */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Logs d'Activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                  <span className="text-xl">{getActivityIcon(log.activityType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{log.description}</p>
                    <p className="text-xs text-white/70 mt-1">
                      {format(new Date(log.createdAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                      {log.ipAddress && ` • ${log.ipAddress}`}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-slate-700 text-white text-xs">
                    {log.activityType.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-amber-500" />
              Informations Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">Version</p>
                <p className="text-xl font-bold text-white">1.0.0</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">Environnement</p>
                <p className="text-xl font-bold text-white">Production</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">Région</p>
                <p className="text-xl font-bold text-white">EU West (Paris)</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400">Uptime</p>
                <p className="text-xl font-bold text-emerald-500">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
