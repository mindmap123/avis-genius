import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRight,
  Phone,
  MousePointer2,
  ChevronDown,
  Building2,
  Store,
  ArrowUpRight,
  Send
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { name: 'Lun', value: 4.2 }, { name: 'Mar', value: 4.5 }, { name: 'Mer', value: 4.3 },
  { name: 'Jeu', value: 4.8 }, { name: 'Ven', value: 4.6 }, { name: 'Sam', value: 4.9 }, { name: 'Dim', value: 4.7 },
];

const stores = [
  { id: 'all', name: 'Tous les établissements' },
  { id: 'marseille', name: 'France Canapé Marseille' },
  { id: 'lyon', name: 'France Canapé Lyon' },
  { id: 'paris-15', name: 'France Canapé Paris 15' },
];

export default function Dashboard() {
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <DashboardLayout 
      headerTitle="Tableau de bord" 
      headerAction={
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white shadow-sm font-medium border-slate-200">
                <Store className="mr-2 h-4 w-4 text-blue-600" />
                {selectedStore.name}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              <DropdownMenuItem onClick={() => setSelectedStore(stores[0])}>Tous les magasins</DropdownMenuItem>
              <DropdownMenuSeparator />
              {stores.slice(1).map(store => (
                <DropdownMenuItem key={store.id} onClick={() => setSelectedStore(store)}>
                  {store.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 font-bold">
            <Send className="mr-2 h-4 w-4" />
            Booster Avis
          </Button>
        </div>
      }
    >
      {/* Business Impact Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Impact CA (Estimé)"
          value="€14,850"
          trend="+22%"
          trendUp={true}
          icon={DollarSign}
          description="via clics GMB"
          className="bg-slate-900 text-white"
        />
        <StatsCard
          title="Note Moyenne"
          value="4.7"
          trend="+0.5"
          trendUp={true}
          icon={Star}
          description="depuis l'IA"
        />
        <StatsCard
          title="Appels Générés"
          value="+42"
          trend="85% conv."
          trendUp={true}
          icon={Phone}
        />
        <StatsCard
          title="Clics Itinéraire"
          value="1,240"
          trend="+12%"
          trendUp={true}
          icon={MousePointer2}
        />
      </div>

      {/* ROI Breakdown Card */}
      <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <Badge className="bg-white/20 text-white border-white/30 text-[10px] uppercase font-bold tracking-widest">Calcul du ROI</Badge>
            <h3 className="text-3xl font-heading font-bold">Comment nous calculons votre CA</h3>
            <p className="text-blue-100/80 leading-relaxed">
              Nous croisons vos données Google Maps (Appels, Itinéraires, Clics site web) avec un panier moyen de <span className="text-white font-bold">850€</span> et un taux de conversion magasin de <span className="text-white font-bold">25%</span>.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm text-center min-w-[140px]">
              <div className="text-3xl font-bold">127</div>
              <div className="text-[10px] uppercase tracking-wider text-blue-100 font-medium">Nouveaux Clics</div>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-sm text-center min-w-[140px]">
              <div className="text-3xl font-bold">38</div>
              <div className="text-[10px] uppercase tracking-wider text-blue-100 font-medium">Appels Tél.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Inbox Section */}
        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-heading font-bold">Inbox Critique</h2>
              <Badge className="bg-red-500 text-white">2 URGENTS</Badge>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Traitement en masse</Button>
          </div>
          
          <div className="space-y-4">
            <ReviewCard
              id="crit-1"
              reviewerName="Jean Dupont"
              rating={1}
              date="Il y a 22min"
              sentiment="urgent"
              storeLocation="Marseille"
              productMentioned="Canapé Nordic"
              content="Livraison catastrophique ! Mon canapé Nordic est arrivé avec un pied cassé et le livreur ne voulait rien savoir. Service client injoignable."
              aiResponse="Bonjour Jean, nous sommes vraiment désolés pour ce problème sur votre canapé Nordic. Notre équipe SAV de Marseille vous contacte dans l'heure pour organiser un remplacement prioritaire. Cordialement, Éric (Gérant France Canapé Marseille)"
            />
            <ReviewCard
              id="crit-2"
              reviewerName="Marie L."
              rating={5}
              date="Il y a 2h"
              sentiment="positive"
              storeLocation="Lyon"
              productMentioned="Fauteuil Velvet"
              content="Expérience superbe à Lyon ! Le fauteuil Velvet est magnifique dans mon salon."
              aiResponse="Bonjour Marie, un grand merci pour ce retour étoilé ! Ravi que le Velvet vous plaise autant qu'à nous. À bientôt chez France Canapé Lyon ! Cordialement, Sarah (Responsable Lyon)"
            />
          </div>
        </div>

        {/* Comparison & Sentiment Side */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Performance Multi-Magasins</CardTitle>
              <Building2 className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {stores.slice(1).map(store => (
                  <div key={store.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        store.id === 'marseille' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {store.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{store.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-medium">Score: 4.8 • 12 avis ce mois</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" /> 15%
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">CA Impact</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold mb-4">Sentiment Récurrent (Top Mots)</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">"Qualité Cuir" +12</Badge>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">"Conseils" +8</Badge>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">"Délais" -3</Badge>
                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">"Prix" 0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}