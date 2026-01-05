import { useState } from "react";
import { useParams, Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { demoOrganizations, demoUsers, demoEstablishments } from "@/lib/demo-data";
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
import { 
  Plus, ArrowLeft, MoreHorizontal, Trash2, Edit, UserX, Shield, Building2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrganizationUsers() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof demoUsers[0] | null>(null);

  // Demo mode: find organization from demo data
  const organization = demoOrganizations.find(o => o.id === id);
  const orgUsers = demoUsers.filter(u => u.organizationId === id);
  const orgEstablishments = demoEstablishments.filter(e => e.organizationId === id);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteOpen(false);
    toast({ title: "Invitation envoyée", description: "L'utilisateur recevra un email d'invitation" });
  };

  const handleSuspend = (userName: string) => {
    toast({ title: "Utilisateur suspendu", description: `${userName} a été suspendu` });
  };

  const handleDelete = (userName: string) => {
    toast({ title: "Utilisateur supprimé", description: `${userName} a été supprimé`, variant: "destructive" });
  };

  const handleSavePermissions = () => {
    setIsPermissionsOpen(false);
    toast({ title: "Permissions mises à jour", description: "Les permissions ont été enregistrées" });
  };

  if (!organization) {
    return (
      <AdminLayout title="Organisation non trouvée" description="">
        <p className="text-white">Cette organisation n'existe pas.</p>
      </AdminLayout>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-amber-500/20 text-amber-500">Propriétaire</Badge>;
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-500">Admin</Badge>;
      case "manager":
        return <Badge className="bg-blue-500/20 text-blue-500">Manager</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">Viewer</Badge>;
    }
  };

  return (
    <AdminLayout 
      title={`Utilisateurs - ${organization.name}`} 
      description={`${orgUsers.length} utilisateur(s) sur ${organization.maxUsers} max`}
    >
      {/* Back button */}
      <div className="mb-6">
        <Link href={`/admin/organizations/${id}`}>
          <Button variant="ghost" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour à l'organisation
          </Button>
        </Link>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white">
          <span className="text-2xl font-semibold">{orgUsers.length}</span>
          <span className="text-slate-400 ml-2">/ {organization.maxUsers} utilisateurs</span>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" /> Inviter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Inviter un utilisateur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input name="email" type="email" required className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Nom</Label>
                <Input name="name" required className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Rôle</Label>
                <Select defaultValue="viewer">
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="admin">Admin (accès complet)</SelectItem>
                    <SelectItem value="manager">Manager (établissements assignés)</SelectItem>
                    <SelectItem value="viewer">Viewer (lecture seule)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                Envoyer l'invitation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-white">Utilisateur</TableHead>
                <TableHead className="text-white">Rôle</TableHead>
                <TableHead className="text-white">Établissements</TableHead>
                <TableHead className="text-white">Statut</TableHead>
                <TableHead className="text-white">Dernière connexion</TableHead>
                <TableHead className="text-white w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgUsers.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={6} className="text-center text-white py-8">
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              ) : (
                orgUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-white">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {user.role === "owner" || user.role === "admin" 
                          ? `Tous (${orgEstablishments.length})`
                          : user.permissions?.length || 0
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {user.lastLoginAt 
                        ? format(new Date(user.lastLoginAt), "dd MMM yyyy", { locale: fr })
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
                          <DropdownMenuItem 
                            className="cursor-pointer text-white"
                            onClick={() => { setSelectedUser(user); setIsPermissionsOpen(true); }}
                          >
                            <Shield className="h-4 w-4 mr-2" /> Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-white">
                            <Edit className="h-4 w-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700" />
                          {user.role !== "owner" && (
                            <>
                              <DropdownMenuItem 
                                className="cursor-pointer text-amber-500 focus:text-amber-500"
                                onClick={() => handleSuspend(user.name)}
                              >
                                <UserX className="h-4 w-4 mr-2" /> Suspendre
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-500 focus:text-red-500"
                                onClick={() => handleDelete(user.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              Permissions - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Role */}
              <div className="space-y-2">
                <Label className="text-white">Rôle</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="admin">Admin (accès complet)</SelectItem>
                    <SelectItem value="manager">Manager (établissements assignés)</SelectItem>
                    <SelectItem value="viewer">Viewer (lecture seule)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Les admins ont accès à tous les établissements. Les managers/viewers n'ont accès qu'aux établissements assignés.
                </p>
              </div>

              {/* Establishments permissions */}
              {(selectedUser.role !== "owner" && selectedUser.role !== "admin") && (
                <div className="space-y-3">
                  <Label className="text-white">Établissements assignés</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orgEstablishments.map((est) => {
                      const hasPerm = selectedUser.permissions?.some(p => p.establishmentId === est.id);
                      return (
                        <Card key={est.id} className="bg-slate-800 border-slate-700">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox defaultChecked={hasPerm} />
                                <div>
                                  <p className="text-white font-medium">{est.name}</p>
                                  <p className="text-xs text-slate-400">{est.address}</p>
                                </div>
                              </div>
                              {hasPerm && (
                                <div className="flex items-center gap-4 text-sm">
                                  <label className="flex items-center gap-2 text-white">
                                    <Switch defaultChecked={true} />
                                    <span>Voir</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-white">
                                    <Switch defaultChecked={selectedUser.permissions?.find(p => p.establishmentId === est.id)?.canRespond} />
                                    <span>Répondre</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-white">
                                    <Switch defaultChecked={selectedUser.permissions?.find(p => p.establishmentId === est.id)?.canManage} />
                                    <span>Gérer</span>
                                  </label>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button onClick={handleSavePermissions} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                Enregistrer les permissions
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
