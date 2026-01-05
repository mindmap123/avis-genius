import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MapPin, CheckCircle2, RefreshCw, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewCardProps {
  id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  date: string;
  content: string;
  aiResponse: string;
  platform?: "google" | "tripadvisor";
  sentiment?: "positive" | "negative" | "neutral";
  status?: "pending" | "posted";
}

export function ReviewCard({
  reviewerName,
  reviewerImage,
  rating,
  date,
  content,
  aiResponse: initialAiResponse,
  platform = "google",
  status = "pending"
}: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState(initialAiResponse);
  const [isPosted, setIsPosted] = useState(status === "posted");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handlePost = () => {
    setIsPosted(true);
    // In a real app, this would make an API call
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setResponse("Thanks so much for the detailed feedback! We're thrilled you enjoyed the Truffle Pasta. It's definitely a crowd favorite. We hope to see you again soon for dinner!");
      setIsRegenerating(false);
    }, 1500);
  };

  if (isPosted) {
    return null; // Or show a simplified "Posted" state, but for Inbox Zero we usually remove it
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 bg-slate-50/50">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarImage src={reviewerImage} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {reviewerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{reviewerName}</h3>
                <span className="text-xs text-muted-foreground">• {date}</span>
                {platform === "google" && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-200 text-blue-700 bg-blue-50">
                    Google
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
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-6">
          <div className="text-sm text-foreground/80 leading-relaxed">
            "{content}"
          </div>

          <div className="relative">
            {/* AI Response Section */}
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 transition-all focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">AI</span>
                  </div>
                  <span className="text-xs font-medium text-blue-900">Suggested Response</span>
                </div>
                <div className="flex items-center gap-1">
                  {!isEditing && (
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-400 hover:text-blue-600"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-400 hover:text-blue-600"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    <RefreshCw className={cn("h-3 w-3", isRegenerating && "animate-spin")} />
                  </Button>
                </div>
              </div>
              
              {isEditing ? (
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-[100px] border-none bg-transparent resize-none focus-visible:ring-0 p-0 text-sm shadow-none"
                />
              ) : (
                <p className={cn("text-sm text-slate-700 leading-relaxed", isRegenerating && "opacity-50 blur-[1px] transition-all")}>
                  {response}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/30 py-3 px-6 flex justify-end gap-2 border-t border-slate-100">
          {isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              Skip
            </Button>
          )}
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm hover:shadow-md transition-all"
            onClick={handlePost}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {isEditing ? "Save & Post" : "Approve & Post"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}