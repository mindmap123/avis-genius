import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminApi } from "@/lib/admin-api";
import { Building2, Mail, Calendar, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useEffect } from "react";

export default function AdminClientDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const { data: client, isLoading } = useQuery({
    queryKey: ["admin", "client", id],
    queryFn: () => adminApi.getClient(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        isActive: client.isActive,
        role: client.role,
        defaultAiTone: client.config?.defaultAiTone || "professional",
        defaultSignature: client.config?.defaultSignature || "",
        customPromptInstructions: client.config?.customPromptInstructions || "",
        autoRespondEnabled: client.config?.autoRespondEnabled || false,
        maxEstablishments: client.config?.maxEstablishments || 5,
      });
    }
  }, [client]);

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => adminApi.updateClient(id!, data as any),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "client", id] }),
  });

  const handleSave = () => {
    updateMutation.mutate({
      name: formData.name as string,
      email: formData.email as string,
      isActive: formData.isActive as boolean,
      role: formData.role as string,
      config: {
        defaultAiTone: formData.defaultAiTone,
        defaultSignature: formData.defaultSignature,
        customPromptInstructions: formData.customPromptInstructions,
        autoRespondEnabled: formData.autoRespondEnabled,
        maxEstablishments: formData.maxEstablishments,
      },
    });
  };


  if (isLoading) {
    return (
      <AdminLayout title="Chargement..." description="">
        <div className="space-y-6">
          <Skeleton className="h-48 bg-slate-800" />
          <Skeleton className="h-64 bg-slate-800" />
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout title="Client non trouvé" description="">
        <p className="text-white">Ce client n'existe pas.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={client.name} description={client.email}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={(formData.name as string) || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={(formData.email as string) || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={(formData.role as string) || "client"} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Compte actif</Label>
              <Switch
                checked={(formData.isActive as boolean) ?? true}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
            </div>
            <div className="pt-2 text-sm text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Inscrit le {format(new Date(client.createdAt), "dd MMMM yyyy", { locale: fr })}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {client.establishments?.length || 0} établissement(s)
              </div>
            </div>
          </CardContent>
        </Card>


        {/* AI Config Card */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Configuration IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ton par défaut</Label>
                <Select value={(formData.defaultAiTone as string) || "professional"} onValueChange={(v) => setFormData({ ...formData, defaultAiTone: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
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
                <Label>Max établissements</Label>
                <Input
                  type="number"
                  value={(formData.maxEstablishments as number) || 5}
                  onChange={(e) => setFormData({ ...formData, maxEstablishments: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Signature par défaut</Label>
              <Input
                value={(formData.defaultSignature as string) || ""}
                onChange={(e) => setFormData({ ...formData, defaultSignature: e.target.value })}
                placeholder="Cordialement, L'équipe..."
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Instructions personnalisées (prompt)</Label>
              <Textarea
                value={(formData.customPromptInstructions as string) || ""}
                onChange={(e) => setFormData({ ...formData, customPromptInstructions: e.target.value })}
                placeholder="Instructions supplémentaires pour l'IA..."
                className="bg-slate-800 border-slate-700 min-h-[100px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Réponse automatique</Label>
                <p className="text-xs text-slate-500">Publier automatiquement les réponses 4-5 étoiles</p>
              </div>
              <Switch
                checked={(formData.autoRespondEnabled as boolean) ?? false}
                onCheckedChange={(v) => setFormData({ ...formData, autoRespondEnabled: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Establishments */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Établissements</CardTitle>
          </CardHeader>
          <CardContent>
            {client.establishments?.length === 0 ? (
              <p className="text-white text-center py-8">Aucun établissement</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {client.establishments?.map((est) => (
                  <div key={est.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                    <h4 className="font-medium">{est.name}</h4>
                    <p className="text-sm text-slate-400">{est.address || "Pas d'adresse"}</p>
                    <Badge className={est.isActive ? "bg-emerald-500/20 text-emerald-500 mt-2" : "bg-red-500/20 text-red-500 mt-2"}>
                      {est.isActive ? "Actif" : "Inactif"}
                    </Badge>
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
