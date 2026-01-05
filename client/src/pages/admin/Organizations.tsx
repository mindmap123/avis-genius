import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { demoOrganizations } from "@/lib/demo-data";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, Search, Building2, MoreHorizontal, Trash2, Eye, Edit, 
  UserX, Download, Filter, Users
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type BillingStatus = "active" | "trial" | "past_due" | "cancelled";

export default function AdminOrganizations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const organizations = demoOrganizations;

  const getStatus = (org: typeof organizations[0]): BillingStatus => {
    return (org.billing?.status as BillingStatus) || "trial";
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(org);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Organisation", "Plan", "Utilisateurs", "Établissements", "Statut", "Créé le"];
    const rows = filteredOrgs.map(org => [
      org.name, 
      org.billing?.planName || "Trial", 
      org.usersCount, 
      org.establishmentsCount, 
      getStatus(org), 
      format(new Date(org.createdAt), "dd/MM/yyyy")
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "organisations-avis-genius.csv";
    a.click();
    toast({ title: "Export réussi", description: `${filteredOrgs.length} organisations exportées` });
  };

  const handleSuspend = (orgName: string) => {
    toast({ title: "Organisation suspendue", description: `${orgName} a été suspendue` });
  };

  const handleDelete = (orgName: string) => {
    toast({ title: "Organisation supprimée", description: `${orgName} a été supprimée`, variant: "destructive" });
  };

  const statusCounts = {
    all: organizations.length,
    active: organizations.filter(o => getStatus(o) === "active").length,
    trial: organizations.filter(o => getStatus(o) === "trial").length,
    cancelled: organizations.filter(o => getStatus(o) === "cancelled").length,
  };

  const getStatusBadge = (status: BillingStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-500">Actif</Badge>;
      case "trial":
        return <Badge className="bg-blue-500/20 text-blue-500">Trial</Badge>;
      case "past_due":
        return <Badge className="bg-amber-500/20 text-amber-500">Impayé</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-500">Annulé</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-500">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Organisations" description="Gérez les organisations de la plateforme">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Rechercher une organisation..."
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
              <SelectItem value="trial">Trial ({statusCounts.trial})</SelectItem>
              <SelectItem value="cancelled">Annulés ({statusCounts.cancelled})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle Organisation
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Créer une nouvelle organisation</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Nom de l'organisation</Label>
                  <Input name="name" required className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Max utilisateurs</Label>
                    <Input name="maxUsers" type="number" defaultValue={5} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Max établissements</Label>
                    <Input name="maxEstablishments" type="number" defaultValue={10} className="bg-slate-800 border-slate-700 text-white" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                  Créer l'organisation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Organizations Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-white">Organisation</TableHead>
                <TableHead className="text-white">Plan</TableHead>
                <TableHead className="text-white">Utilisateurs</TableHead>
                <TableHead className="text-white">Établissements</TableHead>
                <TableHead className="text-white">Statut</TableHead>
                <TableHead className="text-white">Créé le</TableHead>
                <TableHead className="text-white w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrgs.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={7} className="text-center text-white py-8">
                    Aucune organisation trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{org.name}</p>
                        <p className="text-sm text-slate-400">{org.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-white">
                        {org.billing?.planName || "Trial"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Users className="h-4 w-4 text-slate-400" />
                        {org.usersCount} / {org.maxUsers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {org.establishmentsCount} / {org.maxEstablishments}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(getStatus(org))}
                    </TableCell>
                    <TableCell className="text-white">
                      {format(new Date(org.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                          <Link href={`/admin/organizations/${org.id}`}>
                            <DropdownMenuItem className="cursor-pointer text-white">
                              <Eye className="h-4 w-4 mr-2" /> Voir détails
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/admin/organizations/${org.id}/users`}>
                            <DropdownMenuItem className="cursor-pointer text-white">
                              <Users className="h-4 w-4 mr-2" /> Gérer utilisateurs
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/admin/organizations/${org.id}`}>
                            <DropdownMenuItem className="cursor-pointer text-white">
                              <Edit className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            className="cursor-pointer text-amber-500 focus:text-amber-500"
                            onClick={() => handleSuspend(org.name)}
                          >
                            <UserX className="h-4 w-4 mr-2" /> Suspendre
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(org.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
