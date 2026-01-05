import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { demoClients } from "@/lib/demo-data";
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
  UserX, Download, Filter 
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const clients = demoClients;

  const filteredClients = clients.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Nom", "Email", "Plan", "Établissements", "Statut", "Inscrit le"];
    const rows = filteredClients.map(c => [
      c.name, c.email, c.plan, c.establishmentsCount, c.status, 
      format(new Date(c.createdAt), "dd/MM/yyyy")
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients-avis-genius.csv";
    a.click();
    toast({ title: "Export réussi", description: `${filteredClients.length} clients exportés` });
  };

  const handleSuspend = (clientName: string) => {
    toast({ title: "Client suspendu", description: `${clientName} a été suspendu` });
  };

  const handleDelete = (clientName: string) => {
    toast({ title: "Client supprimé", description: `${clientName} a été supprimé`, variant: "destructive" });
  };

  const statusCounts = {
    all: clients.length,
    active: clients.filter(c => c.status === "active").length,
    trial: clients.filter(c => c.status === "trial").length,
    suspended: clients.filter(c => c.status === "suspended").length,
  };

  return (
    <AdminLayout title="Gestion Clients" description="Gérez les comptes clients de la plateforme">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Rechercher un client..."
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
              <SelectItem value="suspended">Suspendus ({statusCounts.suspended})</SelectItem>
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
                <Plus className="h-4 w-4 mr-2" /> Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Créer un nouveau client</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Nom</Label>
                  <Input name="name" required className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email</Label>
                  <Input name="email" type="email" required className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Mot de passe</Label>
                  <Input name="password" type="password" required minLength={6} className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                  Créer le client
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      {/* Clients Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-white">Client</TableHead>
                <TableHead className="text-white">Plan</TableHead>
                <TableHead className="text-white">Établissements</TableHead>
                <TableHead className="text-white">Statut</TableHead>
                <TableHead className="text-white">Dernière connexion</TableHead>
                <TableHead className="text-white w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={6} className="text-center text-white py-8">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{client.name}</p>
                        <p className="text-sm text-slate-400">{client.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-white">
                        {client.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {client.establishmentsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        client.status === "active" ? "bg-emerald-500/20 text-emerald-500" :
                        client.status === "trial" ? "bg-blue-500/20 text-blue-500" :
                        "bg-red-500/20 text-red-500"
                      }>
                        {client.status === "active" ? "Actif" : client.status === "trial" ? "Trial" : "Suspendu"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {client.lastLoginAt 
                        ? format(new Date(client.lastLoginAt), "dd MMM yyyy", { locale: fr })
                        : "Jamais"
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                          <Link href={`/admin/clients/${client.id}`}>
                            <DropdownMenuItem className="cursor-pointer text-white">
                              <Eye className="h-4 w-4 mr-2" /> Voir détails
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/admin/clients/${client.id}`}>
                            <DropdownMenuItem className="cursor-pointer text-white">
                              <Edit className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          <DropdownMenuItem 
                            className="cursor-pointer text-amber-500 focus:text-amber-500"
                            onClick={() => handleSuspend(client.name)}
                          >
                            <UserX className="h-4 w-4 mr-2" /> Suspendre
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500 focus:text-red-500"
                            onClick={() => handleDelete(client.name)}
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
