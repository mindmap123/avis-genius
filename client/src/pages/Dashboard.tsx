import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', value: 4.2 },
  { name: 'Tue', value: 4.5 },
  { name: 'Wed', value: 4.3 },
  { name: 'Thu', value: 4.8 },
  { name: 'Fri', value: 4.6 },
  { name: 'Sat', value: 4.9 },
  { name: 'Sun', value: 4.7 },
];

export default function Dashboard() {
  return (
    <DashboardLayout 
      headerTitle="Dashboard" 
      headerAction={
        <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
          Sync Reviews
        </Button>
      }
    >
      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue Impact"
          value="€12,450"
          trend="+15% vs last month"
          trendUp={true}
          icon={DollarSign}
          className="bg-gradient-to-br from-white to-blue-50/50"
        />
        <StatsCard
          title="Average Rating"
          value="4.8"
          trend="+0.2 this week"
          trendUp={true}
          icon={Star}
        />
        <StatsCard
          title="Reviews Managed"
          value="128"
          trend="12 pending"
          trendUp={undefined}
          icon={Users}
        />
        <StatsCard
          title="Response Rate"
          value="98%"
          trend="+5% improvement"
          trendUp={true}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7 h-full">
        {/* Main Feed - Left Side */}
        <div className="md:col-span-4 lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-semibold">Pending Reviews (3)</h2>
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <ReviewCard
              id="1"
              reviewerName="Sarah Jenkins"
              rating={5}
              date="2 hours ago"
              content="Absolutely loved the atmosphere! The wine selection was incredible and the staff made us feel so welcome. Will definitely be back for the jazz night."
              aiResponse="Thank you so much, Sarah! We're delighted to hear you enjoyed the atmosphere and our wine selection. Our team loves making guests feel at home. We can't wait to welcome you back for jazz night – it's always a special evening!"
            />
            <ReviewCard
              id="2"
              reviewerName="Michael Chen"
              rating={4}
              date="5 hours ago"
              content="Great food, but the service was a bit slow during the lunch rush. The risotto was perfect though."
              aiResponse="Hi Michael, thank you for your feedback. We're glad you enjoyed the risotto! We apologize for the wait during lunch; we're working on optimizing our service during peak hours. We hope to impress you with faster service next time!"
            />
            <ReviewCard
              id="3"
              reviewerName="Emma Wilson"
              rating={5}
              date="1 day ago"
              content="Best brunch spot in the city. The avocado toast is to die for!"
              aiResponse="Emma, that's high praise! Thank you! We're so happy you love the avocado toast – it's one of our favorites too. See you again soon for brunch!"
            />
          </div>
        </div>

        {/* Analytics - Right Side */}
        <div className="md:col-span-3 lg:col-span-3 space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <h3 className="font-heading font-semibold mb-6">Sentiment Trend</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    domain={[3, 5]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-emerald-900/5 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
             <h3 className="font-heading font-semibold mb-2 text-emerald-900">ROI Insight</h3>
             <p className="text-sm text-emerald-800/80 mb-4">
               Your 4.8 star rating is driving an estimated <span className="font-bold text-emerald-700">24% more foot traffic</span> compared to local competitors.
             </p>
             <Button size="sm" variant="outline" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
               View Full Report
             </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}