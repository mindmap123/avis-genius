import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoEstablishments } from "@/lib/demo-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, User, Star, MessageSquare, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminEstablishments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const establishments = demoEstablishments;

  const filtered = establishments.filter((e) => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      e.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && e.isActive) ||
      (statusFilter === "inactive" && !e.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Nom", "Adresse", "Propriétaire", "Avis", "Note", "Statut"];
    const rows = filtered.map(e => [
      e.name, e.address || "", e.ownerName, e.reviewsCount, e.avgRating, e.isActive ? "Actif" : "Inactif"
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "etablissements-avis-genius.csv";
    a.click();
    toast({ title: "Export réussi", description: `${filtered.length} établissements exportés` });
  };

  const statusCounts = {
    all: establishments.length,
    active: establishments.filter(e => e.isActive).length,
    inactive: establishments.filter(e => !e.isActive).length,
  };

  return (
    <AdminLayout title="Établissements" description="Vue globale de tous les établissements">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Tous ({statusCounts.all})</SelectItem>
              <SelectItem value="active">Actifs ({statusCounts.active})</SelectItem>
              <SelectItem value="inactive">Inactifs ({statusCounts.inactive})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700" onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-white">Établissement</TableHead>
                <TableHead className="text-white">Propriétaire</TableHead>
                <TableHead className="text-white">Avis</TableHead>
                <TableHead className="text-white">Note</TableHead>
                <TableHead className="text-white">Statut</TableHead>
                <TableHead className="text-white">Créé le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={6} className="text-center text-white py-8">
                    Aucun établissement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((est) => (
                  <TableRow key={est.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{est.name}</p>
                        {est.address && (
                          <p className="text-sm text-slate-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {est.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm text-white">{est.ownerName}</p>
                          <p className="text-xs text-slate-400">{est.ownerEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-white">
                            <MessageSquare className="h-4 w-4 text-slate-400" />
                            {est.reviewsCount}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{est.reviewsCount} avis au total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-white">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            {est.avgRating}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Note moyenne: {est.avgRating}/5</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge className={est.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}>
                        {est.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {format(new Date(est.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
