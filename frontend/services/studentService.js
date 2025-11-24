// services/studentService.js
import { apiBaseUrl } from "../config/api.js";

export async function fetchStatus(studentId, token) {
  const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200) return res.json();
  if (res.status === 404) return null;

  throw new Error("STATUS_FETCH_FAILED");
}

export async function declarePlan(studentId, token, planId) {
  const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });

  if (res.status === 201) return res.json();
  if (res.status === 409) throw new Error("ALREADY_DECLARED");

  throw new Error("DECLARE_FAILED");
}

export async function changePlan(studentId, token, planId) {
  const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });

  if (res.status === 200) return res.json();
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (res.status === 409) throw new Error("CANCELLED");

  throw new Error("CHANGE_FAILED");
}

export async function cancelPlan(studentId, token) {
  const res = await fetch(`${apiBaseUrl}/students/${studentId}/declared-plan`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200) return res.json();
  if (res.status === 204)
    return { status: "CANCELLED", updatedAt: new Date().toISOString() };
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (res.status === 409) throw new Error("ALREADY_CANCELLED");

  throw new Error("CANCEL_FAILED");
}
