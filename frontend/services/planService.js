// services/planService.js
import { apiBaseUrl } from "../config/api.js";

export async function getStudyPlans(token) {
  const res = await fetch(`${apiBaseUrl}/study-plans`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("LOAD_PLANS_FAILED");

  return res.json();
}
