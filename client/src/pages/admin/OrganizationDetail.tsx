import { useParams, Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoOrganizations, demoUsers, demoEstablishments } from "@/lib/demo-data";
import { Building2, Calendar, Save, Users, CreditCard, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrganizationDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  // Demo mode: find organization from demo data
  const organization = demoOrganizations.find(o => o.id === id);
  const orgUsers = demoUsers.filter(u => u.organizationId === id);
  const orgEstablishments = demoEstablishments.filter(e => e.organizationId === id);

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        isActive: organization.isActive,
        defaultAiTone: organization.defaultAiTone || "professional",
        defaultSignature: organization.defaultSignature || "",
        maxUsers: organization.maxUsers || 5,
        maxEstablishments: organization.maxEstablishments || 10,
      });
    }
  }, [organization]);

  const handleSave = () => {
    toast({ title: "Modifications enregistrées", description: "L'organisation a été mise à jour" });
  };

  if (!organization) {
    return (
      <AdminLayout title="Organisation non trouvée" description="">
        <p className="text-white">Cette organisation n'existe pas.</p>
      </AdminLayout>
    );
  }

  const billingStatus = organization.billing?.status || "trial";

  return (
    <AdminLayout title={organization.name} description={`Slug: ${organization.slug}`}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Nom</Label>
              <Input
                value={(formData.name as string) || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Slug</Label>
              <Input
                value={(formData.slug as string) || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Max utilisateurs</Label>
                <Input
                  type="number"
                  value={(formData.maxUsers as number) || 5}
                  onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Max établissements</Label>
                <Input
                  type="number"
                  value={(formData.maxEstablishments as number) || 10}
                  onChange={(e) => setFormData({ ...formData, maxEstablishments: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-white">Organisation active</Label>
              <Switch
                checked={(formData.isActive as boolean) ?? true}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
            </div>
            <div className="pt-2 text-sm text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Créée le {format(new Date(organization.createdAt), "dd MMMM yyyy", { locale: fr })}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {orgUsers.length} utilisateur(s)
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {orgEstablishments.length} établissement(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Config Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Configuration IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Ton par défaut</Label>
              <Select value={(formData.defaultAiTone as string) || "professional"} onValueChange={(v) => setFormData({ ...formData, defaultAiTone: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="formal">Formel</SelectItem>
                  <SelectItem value="friendly">Amical</SelectItem>
                  <SelectItem value="professional">Professionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Signature par défaut</Label>
              <Textarea
                value={(formData.defaultSignature as string) || ""}
                onChange={(e) => setFormData({ ...formData, defaultSignature: e.target.value })}
                placeholder="Cordialement, L'équipe..."
                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Facturation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Plan</span>
              <Badge variant="outline" className="border-slate-600 text-white">
                {organization.billing?.planName || "Trial"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Statut</span>
              <Badge className={
                billingStatus === "active" ? "bg-emerald-500/20 text-emerald-500" :
                billingStatus === "trial" ? "bg-blue-500/20 text-blue-500" :
                billingStatus === "past_due" ? "bg-amber-500/20 text-amber-500" :
                "bg-red-500/20 text-red-500"
              }>
                {billingStatus === "active" ? "Actif" : 
                 billingStatus === "trial" ? "Trial" : 
                 billingStatus === "past_due" ? "Impayé" : "Annulé"}
              </Badge>
            </div>
            {organization.billing?.trialEndsAt && (
              <div className="flex items-center justify-between">
                <span className="text-white">Fin du trial</span>
                <span className="text-slate-400">
                  {format(new Date(organization.billing.trialEndsAt), "dd MMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
            {organization.billing?.currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-white">Prochaine facture</span>
                <span className="text-slate-400">
                  {format(new Date(organization.billing.currentPeriodEnd), "dd MMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-white">Utilisateurs ({orgUsers.length})</CardTitle>
            <Link href={`/admin/organizations/${id}/users`}>
              <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                Gérer <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {orgUsers.length === 0 ? (
              <p className="text-white text-center py-8">Aucun utilisateur</p>
            ) : (
              <div className="space-y-3">
                {orgUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        user.role === "owner" ? "bg-amber-500/20 text-amber-500" :
                        user.role === "admin" ? "bg-purple-500/20 text-purple-500" :
                        user.role === "manager" ? "bg-blue-500/20 text-blue-500" :
                        "bg-slate-500/20 text-slate-400"
                      }>
                        {user.role === "owner" ? "Propriétaire" :
                         user.role === "admin" ? "Admin" :
                         user.role === "manager" ? "Manager" : "Viewer"}
                      </Badge>
                      <Badge className={user.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Establishments Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Établissements ({orgEstablishments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orgEstablishments.length === 0 ? (
              <p className="text-white text-center py-8">Aucun établissement</p>
            ) : (
              <div className="space-y-3">
                {orgEstablishments.map((est) => (
                  <div key={est.id} className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{est.name}</p>
                      <Badge className={est.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}>
                        {est.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{est.address || "Pas d'adresse"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
          <Save className="h-4 w-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>
    </AdminLayout>
  );
}
