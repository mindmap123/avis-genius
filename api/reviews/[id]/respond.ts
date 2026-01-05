import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../../lib/auth";
import { getReview, updateReview, getEstablishment, createResponse, updateResponse, getResponseByReview } from "../../lib/storage";

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

    const { finalText } = req.body;
    if (!finalText || typeof finalText !== "string") {
      return res.status(400).json({ error: "finalText is required" });
    }

    // Check if response exists
    let response = await getResponseByReview(id);
    
    if (response) {
      response = await updateResponse(response.id, { 
        finalText, 
        postedToGoogle: true, 
        postedAt: new Date() 
      });
    } else {
      response = await createResponse({
        reviewId: id,
        aiGeneratedText: finalText,
        finalText,
        postedToGoogle: true,
        postedAt: new Date(),
      });
    }

    // Update review status
    await updateReview(id, { status: "responded" });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Respond error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
