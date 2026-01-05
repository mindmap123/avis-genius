import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean | null;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  trend, 
  trendUp, 
  icon: Icon, 
  description,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className={cn("rounded-full p-2", 
            trendUp === true ? "bg-emerald-100 text-emerald-600" : 
            trendUp === false ? "bg-red-100 text-red-600" : 
            "bg-blue-100 text-blue-600"
          )}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-heading font-bold text-foreground">{value}</h2>
          {(trend || description) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trend && (
                <span className={cn("font-medium flex items-center gap-0.5", 
                  trendUp === true ? "text-emerald-600" : 
                  trendUp === false ? "text-red-600" : 
                  "text-blue-600"
                )}>
                  {trendUp === true && <ArrowUpRight className="h-3 w-3" />}
                  {trendUp === false && <ArrowDownRight className="h-3 w-3" />}
                  {trendUp === null && <Minus className="h-3 w-3" />}
                  {trend}
                </span>
              )}
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}