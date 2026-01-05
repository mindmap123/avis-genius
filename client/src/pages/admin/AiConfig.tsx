import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { demoAiTemplates } from "@/lib/demo-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Bot, Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAiConfig() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<typeof demoAiTemplates[0] | null>(null);
  const { toast } = useToast();

  const templates = demoAiTemplates;

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Copié !", description: "Le prompt a été copié dans le presse-papier" });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "positive": return "bg-emerald-500/20 text-emerald-500";
      case "neutral": return "bg-blue-500/20 text-blue-500";
      case "urgent": return "bg-red-500/20 text-red-500";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "positive": return "Positif (4-5⭐)";
      case "neutral": return "Neutre (3⭐)";
      case "urgent": return "Urgent (1-2⭐)";
      default: return category;
    }
  };

  return (
    <AdminLayout title="Configuration IA" description="Gérez les templates de prompts IA">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-500">Positif: 1</Badge>
          <Badge className="bg-blue-500/20 text-blue-500">Neutre: 1</Badge>
          <Badge className="bg-red-500/20 text-red-500">Urgent: 1</Badge>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" /> Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Créer un template IA</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Nom</Label>
                  <Input name="name" required className="bg-slate-800 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Catégorie</Label>
                  <Input name="category" placeholder="positive, neutral, urgent" className="bg-slate-800 border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Description</Label>
                <Input name="description" className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Template du Prompt</Label>
                <Textarea
                  name="promptTemplate"
                  required
                  className="bg-slate-800 border-slate-700 text-white min-h-[200px] font-mono text-sm"
                  placeholder="Tu es un assistant qui génère des réponses aux avis..."
                />
              </div>
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                Créer le template
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                  <p className="text-sm text-slate-400 mt-1">{template.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getCategoryColor(template.category)}>
                  {getCategoryLabel(template.category)}
                </Badge>
                <Badge className={template.isActive ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-700 text-slate-400"}>
                  {template.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-slate-300 bg-slate-800 p-3 rounded-lg overflow-auto max-h-32 font-mono">
                {template.promptTemplate.slice(0, 150)}...
              </pre>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-slate-800"
                    onClick={() => setViewingTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-slate-800"
                    onClick={() => handleCopyPrompt(template.promptTemplate)}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copier
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Template Dialog */}
      <Dialog open={!!viewingTemplate} onOpenChange={() => setViewingTemplate(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-500" />
              {viewingTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-400">Description</Label>
              <p className="text-white">{viewingTemplate?.description}</p>
            </div>
            <div>
              <Label className="text-slate-400">Catégorie</Label>
              <Badge className={getCategoryColor(viewingTemplate?.category || "")}>
                {getCategoryLabel(viewingTemplate?.category || "")}
              </Badge>
            </div>
            <div>
              <Label className="text-slate-400">Prompt Template</Label>
              <pre className="text-sm text-slate-300 bg-slate-800 p-4 rounded-lg overflow-auto font-mono whitespace-pre-wrap">
                {viewingTemplate?.promptTemplate}
              </pre>
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
              onClick={() => handleCopyPrompt(viewingTemplate?.promptTemplate || "")}
            >
              <Copy className="h-4 w-4 mr-2" /> Copier le prompt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
