import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, RefreshCw, Pencil, AlertCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReviewCardProps {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  date: string;
  content: string;
  aiResponse: string;
  platform?: "google" | "tripadvisor";
  status?: "pending" | "posted";
  sentiment?: "urgent" | "positive" | "neutral";
  productMentioned?: string;
  storeLocation?: string;
}

export function ReviewCard({
  reviewerName,
  reviewerImage,
  rating,
  date,
  content,
  aiResponse: initialAiResponse,
  platform = "google",
  status = "pending",
  sentiment,
  productMentioned,
  storeLocation
}: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState(initialAiResponse);
  const [isPosted, setIsPosted] = useState(status === "posted");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handlePost = () => {
    setIsPosted(true);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setResponse(`Bonjour ${reviewerName.split(' ')[0]},\nMerci pour votre retour sur le ${productMentioned || 'produit'}. Nous sommes ravis que vous ayez apprécié votre visite chez France Canapé ${storeLocation || 'Marseille'}. Au plaisir de vous revoir !\nCordialement, Éric (Gérant)`);
      setIsRegenerating(false);
    }, 1000);
  };

  if (isPosted) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden border-border/60 shadow-sm transition-all duration-300",
        sentiment === 'urgent' && "border-red-200 ring-1 ring-red-100 shadow-red-100"
      )}>
        <CardHeader className={cn(
          "flex flex-row items-start justify-between space-y-0 pb-4",
          sentiment === 'urgent' ? "bg-red-50/50" : "bg-slate-50/50"
        )}>
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarImage src={reviewerImage} />
              <AvatarFallback className={cn(
                "font-bold",
                sentiment === 'urgent' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              )}>
                {reviewerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{reviewerName}</h3>
                <span className="text-xs text-muted-foreground">• {date}</span>
                {sentiment === 'urgent' && (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 gap-1 h-5 px-1.5 text-[10px] uppercase font-bold tracking-wider">
                    <AlertCircle className="h-3 w-3" /> Urgent
                  </Badge>
                )}
              </div>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5 mr-0.5",
                      i < rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"
                    )}
                  />
                ))}
                {storeLocation && (
                  <span className="ml-2 text-[10px] text-muted-foreground font-medium uppercase">
                    📍 {storeLocation}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-200 text-blue-700 bg-blue-50">
            {platform.toUpperCase()}
          </Badge>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-6">
          <div className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-slate-200 pl-4 py-1">
            "{content}"
          </div>

          <div className="relative">
            <div className={cn(
              "rounded-xl border p-4 transition-all focus-within:ring-2",
              sentiment === 'urgent' 
                ? "bg-red-50/30 border-red-100 focus-within:ring-red-100 focus-within:border-red-200" 
                : "bg-blue-50/30 border-blue-100 focus-within:ring-blue-100 focus-within:border-blue-200"
            )}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center",
                    sentiment === 'urgent' ? "bg-red-500" : "bg-blue-500"
                  )}>
                    <MessageSquare className="h-3 w-3 text-white" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    sentiment === 'urgent' ? "text-red-700" : "text-blue-700"
                  )}>Réponse Suggérée (IA)</span>
                </div>
                <div className="flex items-center gap-1">
                  {!isEditing && (
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-400 hover:text-slate-600"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-400 hover:text-slate-600"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    <RefreshCw className={cn("h-3 w-3", isRegenerating && "animate-spin")} />
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                readOnly={!isEditing}
                className={cn(
                  "min-h-[100px] border-none bg-transparent resize-none focus-visible:ring-0 p-0 text-sm shadow-none font-medium leading-relaxed",
                  !isEditing && "cursor-default",
                  isRegenerating && "opacity-50 blur-[1px]"
                )}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/30 py-3 px-6 flex justify-end gap-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">Ignorer</Button>
          <Button 
            size="sm" 
            className={cn(
              "text-white font-bold shadow-sm hover:shadow-md transition-all px-4",
              sentiment === 'urgent' ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            )}
            onClick={handlePost}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isEditing ? "Enregistrer & Publier" : "Approuver & Publier"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}