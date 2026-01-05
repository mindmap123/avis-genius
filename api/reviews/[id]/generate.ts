import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../../lib/auth";
import { getReview, getEstablishment, createResponse, getResponseByReview, updateResponse } from "../../lib/storage";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const review = await getReview(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const establishment = await getEstablishment(review.establishmentId);
    if (!establishment || establishment.userId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Build prompt based on establishment settings
    const toneMap = {
      formal: "formel et professionnel",
      friendly: "chaleureux et amical",
      professional: "professionnel mais accessible",
    };
    const tone = toneMap[establishment.aiTone || "professional"];
    const signature = establishment.signatureTemplate || `Cordialement, L'équipe ${establishment.name}`;

    const prompt = `Tu es un assistant qui rédige des réponses aux avis Google My Business pour "${establishment.name}".

Ton: ${tone}
Signature à utiliser: ${signature}

Avis client:
- Auteur: ${review.authorName}
- Note: ${review.rating}/5 étoiles
- Contenu: "${review.content || "Pas de commentaire"}"

Règles:
- Réponse en français, 2-4 phrases maximum
- Personnalise avec le prénom du client
- Si avis négatif (1-2 étoiles): excuse-toi, propose une solution, invite à recontacter
- Si avis positif (4-5 étoiles): remercie chaleureusement, invite à revenir
- Si avis neutre (3 étoiles): remercie, demande comment améliorer
- Termine par la signature

Génère uniquement la réponse, sans guillemets ni explications.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const aiGeneratedText = result.response.text().trim();

    // Save or update response
    let response = await getResponseByReview(id);
    if (response) {
      response = await updateResponse(response.id, { aiGeneratedText });
    } else {
      response = await createResponse({
        reviewId: id,
        aiGeneratedText,
      });
    }

    return res.status(200).json({ 
      response: aiGeneratedText,
      responseId: response?.id 
    });
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}
