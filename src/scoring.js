import { roleScore, industryScore, completenessScore } from "./utils.js";
import { getAIIntent } from "./service.js";

export async function scoreLeads(leads, offer) {
  const results = [];
  for (const lead of leads) {
    const rScore = roleScore(lead.role) + industryScore(lead.industry, offer.ideal_use_cases) + completenessScore(lead);
    const ai = await getAIIntent(lead, offer);
    const aiPoints = ai.intent === "High" ? 50 : ai.intent === "Medium" ? 30 : 10;
    const total = Math.min(100, rScore + aiPoints);

    results.push({
      ...lead,
      intent: ai.intent,
      score: total,
      reasoning: `${ai.reason} (rule=${rScore}, ai=${aiPoints})`
    });
  }
  return results;
}
