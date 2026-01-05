import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, ShoppingBag, Target, ArrowUpRight } from "lucide-react";

const revenueData = [
  { month: 'Jan', revenue: 12000, reviews: 45 },
  { month: 'Feb', revenue: 13500, reviews: 52 },
  { month: 'Mar', revenue: 15000, reviews: 68 },
  { month: 'Apr', revenue: 14200, reviews: 60 },
  { month: 'May', revenue: 18500, reviews: 85 },
  { month: 'Jun', revenue: 21000, reviews: 92 },
];

const sentimentData = [
  { name: 'Qualité', pos: 85, neg: 5 },
  { name: 'Service', pos: 72, neg: 15 },
  { name: 'Prix', pos: 60, neg: 20 },
  { name: 'Livraison', pos: 45, neg: 35 },
];

const competitorData = [
  { name: 'Vous', rating: 4.7, reviews: 128 },
  { name: 'Canapé Co', rating: 4.2, reviews: 85 },
  { name: 'Maison Luxe', rating: 4.5, reviews: 110 },
  { name: 'Design+ ', rating: 3.9, reviews: 42 },
];

export default function Analytics() {
  return (
    <DashboardLayout headerTitle="Analytics & ROI">
      <div className="grid gap-6">
        
        {/* Detailed ROI Hero */}
        <div className="grid md:grid-cols-3 gap-6">
           <Card className="bg-slate-900 text-white border-none col-span-2">
             <CardContent className="p-8 flex items-center justify-between">
                <div>
                   <Badge className="bg-emerald-500 text-white border-none mb-4">PERFORMANCE JUIN</Badge>
                   <h2 className="text-5xl font-heading font-bold mb-2">€21,000 <span className="text-xl text-slate-400 font-normal">CA Estimé</span></h2>
                   <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                         <TrendingUp className="h-4 w-4" /> +28%
                      </div>
                      <div className="text-slate-400 text-sm">vs moyenne secteur</div>
                   </div>
                </div>
                <div className="hidden md:block">
                   <div className="h-24 w-48 bg-white/5 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                      <div className="h-full w-full flex items-end gap-1">
                         {[30, 45, 25, 60, 40, 75, 55].map((h, i) => (
                           <div key={i} className="flex-1 bg-emerald-500/50 rounded-t-sm" style={{height: `${h}%`}} />
                         ))}
                      </div>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card className="bg-blue-600 text-white border-none">
             <CardHeader>
               <CardTitle className="text-lg">Funnel Conversion</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-xs text-blue-100 uppercase tracking-widest font-bold">Clics GMB</span>
                   <span className="text-xl font-bold">1,240</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-xs text-blue-100 uppercase tracking-widest font-bold">Prospects</span>
                   <span className="text-xl font-bold">127</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-xs text-blue-100 uppercase tracking-widest font-bold">Ventes</span>
                   <span className="text-xl font-bold">~32</span>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sentiment Heatmap */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Heatmap des Plaintes & Éloges</CardTitle>
                <CardDescription>Analyse sémantique des retours clients.</CardDescription>
              </div>
              <Target className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="pos" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="neg" stackId="a" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="h-3 w-3 rounded bg-emerald-500" /> POSITIF
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="h-3 w-3 rounded bg-red-500" /> NÉGATIF
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Benchmarking */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Benchmarking Local</CardTitle>
                <CardDescription>Classement face aux concurrents de proximité.</CardDescription>
              </div>
              <Users className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
               <div className="space-y-6 pt-4">
                  {competitorData.map((comp, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      comp.name === 'Vous' ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100" : "bg-slate-50 border-slate-100"
                    )}>
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold">
                             {i + 1}
                          </div>
                          <div>
                             <div className="font-bold flex items-center gap-2">
                               {comp.name}
                               {comp.name === 'Vous' && <Badge className="bg-blue-600 text-white h-4 px-1 text-[8px]">TOP</Badge>}
                             </div>
                             <div className="text-xs text-muted-foreground">{comp.reviews} avis Google</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-slate-900">{comp.rating}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}