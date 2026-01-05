import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "./lib/auth";
import { 
  getReviewsByEstablishment, getEstablishment, getEstablishmentIdsForUser,
  getReview, updateReview, createResponse, getResponseByReview, updateResponse,
  getUserPermissionForEstablishment, getReviewsByEstablishments
} from "./lib/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id, action, establishmentId, status } = req.query;

  try {
    // GET /api/reviews - List reviews
    if (req.method === "GET" && !id) {
      const accessibleIds = await getEstablishmentIdsForUser(user);
      
      if (typeof establishmentId === "string") {
        if (!accessibleIds.includes(establishmentId)) {
          return res.status(403).json({ error: "Access denied" });
        }
        const reviews = await getReviewsByEstablishment(establishmentId);
        return res.status(200).json(reviews);
      }
      
      let reviews = await getReviewsByEstablishments(accessibleIds);
      if (typeof status === "string") {
        reviews = reviews.filter(r => r.status === status);
      }
      return res.status(200).json(reviews);
    }

    // POST /api/reviews?id=xxx&action=generate - Generate AI response
    if (req.method === "POST" && id && action === "generate") {
      const review = await getReview(id as string);
      if (!review) return res.status(404).json({ error: "Review not found" });
      
      const establishment = await getEstablishment(review.establishmentId);
      if (!establishment) return res.status(404).json({ error: "Establishment not found" });
      
      // Check access
      const accessibleIds = await getEstablishmentIdsForUser(user);
      if (!accessibleIds.includes(establishment.id)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Check respond permission for manager/viewer
      if (user.role === "manager" || user.role === "viewer") {
        const perm = await getUserPermissionForEstablishment(user.id, establishment.id);
        if (!perm?.canRespond) {
          return res.status(403).json({ error: "You don't have permission to respond to reviews" });
        }
      }

      const toneMap: Record<string, string> = {
        formal: "formel et professionnel",
        friendly: "chaleureux et amical",
        professional: "professionnel mais accessible",
      };
      const tone = toneMap[establishment.aiTone || "professional"];
      const signature = establishment.signatureTemplate || `Cordialement, L'équipe ${establishment.name}`;

      const prompt = `Tu es un assistant qui rédige des réponses aux avis Google My Business pour "${establishment.name}".
Ton: ${tone}
Signature: ${signature}
Avis client:
- Auteur: ${review.authorName}
- Note: ${review.rating}/5
- Contenu: "${review.content || "Pas de commentaire"}"
Règles: Réponse en français, 2-4 phrases max. Personnalise avec le prénom. Si négatif: excuse + solution. Si positif: remercie + invite à revenir.
Génère uniquement la réponse, sans guillemets.`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const aiGeneratedText = result.response.text().trim();

      let response = await getResponseByReview(id as string);
      if (response) {
        response = await updateResponse(response.id, { aiGeneratedText, userId: user.id });
      } else {
        response = await createResponse({ reviewId: id as string, aiGeneratedText, userId: user.id });
      }

      return res.status(200).json({ response: aiGeneratedText, responseId: response?.id });
    }

    // POST /api/reviews?id=xxx&action=respond - Post response
    if (req.method === "POST" && id && action === "respond") {
      const review = await getReview(id as string);
      if (!review) return res.status(404).json({ error: "Review not found" });
      
      const establishment = await getEstablishment(review.establishmentId);
      if (!establishment) return res.status(404).json({ error: "Establishment not found" });
      
      // Check access
      const accessibleIds = await getEstablishmentIdsForUser(user);
      if (!accessibleIds.includes(establishment.id)) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Check respond permission for manager/viewer
      if (user.role === "manager" || user.role === "viewer") {
        const perm = await getUserPermissionForEstablishment(user.id, establishment.id);
        if (!perm?.canRespond) {
          return res.status(403).json({ error: "You don't have permission to respond to reviews" });
        }
      }

      const { finalText } = req.body;
      if (!finalText) return res.status(400).json({ error: "finalText required" });

      let response = await getResponseByReview(id as string);
      if (response) {
        response = await updateResponse(response.id, { 
          finalText, 
          postedToGoogle: true, 
          postedAt: new Date(),
          userId: user.id,
        });
      } else {
        response = await createResponse({
          reviewId: id as string,
          aiGeneratedText: finalText,
          finalText,
          postedToGoogle: true,
          postedAt: new Date(),
          userId: user.id,
        });
      }
      await updateReview(id as string, { status: "responded" });

      return res.status(200).json(response);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Reviews error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
