import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reviews() {
  return (
    <DashboardLayout headerTitle="Reviews">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews..." 
              className="pl-10 bg-white border-border/80 shadow-sm focus-visible:ring-primary/20" 
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white shadow-sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="bg-white shadow-sm">
              Oldest First
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="bg-white border border-border/60 p-1 mb-6 shadow-sm">
            <TabsTrigger value="pending" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Pending (3)</TabsTrigger>
            <TabsTrigger value="posted" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">Posted (124)</TabsTrigger>
            <TabsTrigger value="flagged" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Flagged (1)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
          </TabsContent>
          
          <TabsContent value="posted">
            <div className="text-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-muted-foreground">This is where your history of responded reviews would appear.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}