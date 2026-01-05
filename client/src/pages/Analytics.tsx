import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12000, reviews: 45 },
  { month: 'Feb', revenue: 13500, reviews: 52 },
  { month: 'Mar', revenue: 15000, reviews: 68 },
  { month: 'Apr', revenue: 14200, reviews: 60 },
  { month: 'May', revenue: 18500, reviews: 85 },
  { month: 'Jun', revenue: 21000, reviews: 92 },
];

export default function Analytics() {
  return (
    <DashboardLayout headerTitle="Analytics & ROI">
      <div className="grid gap-6">
        
        {/* Hero ROI Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">€21,000</h2>
              <p className="text-blue-100 text-lg">Estimated revenue influenced by reputation in June</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 min-w-[150px] text-center">
              <span className="block text-2xl font-bold">+28%</span>
              <span className="text-xs text-blue-100">vs last year</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle>Revenue vs. Review Volume</CardTitle>
              <CardDescription>Direct correlation between positive review volume and monthly revenue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                    />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="reviews" stroke="hsl(var(--chart-3))" strokeWidth={3} dot={{r: 4}} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle>Source Breakdown</CardTitle>
              <CardDescription>Where your customers are finding you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Google Maps</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[78%] rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>TripAdvisor</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[15%] rounded-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>Yelp / Other</span>
                    <span className="font-bold">7%</span>
                  </div>
                  <div className="h-2 w-full bg-yellow-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[7%] rounded-full" />
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Insight:</strong> Google Maps continues to be your dominant channel. Increasing review frequency here has the highest ROI leverage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}