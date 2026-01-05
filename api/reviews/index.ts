import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuthUser } from "../lib/auth";
import { getReviewsByEstablishment, getEstablishment, getEstablishmentsByUser } from "../lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { establishmentId, status } = req.query;

    // If specific establishment requested
    if (typeof establishmentId === "string") {
      const establishment = await getEstablishment(establishmentId);
      if (!establishment || establishment.userId !== user.id) {
        return res.status(404).json({ error: "Establishment not found" });
      }
      const reviews = await getReviewsByEstablishment(establishmentId);
      return res.status(200).json(reviews);
    }

    // Get all reviews for all user's establishments
    const establishments = await getEstablishmentsByUser(user.id);
    const allReviews = await Promise.all(
      establishments.map(e => getReviewsByEstablishment(e.id))
    );
    
    let reviews = allReviews.flat();
    
    // Filter by status if provided
    if (typeof status === "string") {
      reviews = reviews.filter(r => r.status === status);
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Reviews error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
