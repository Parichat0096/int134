export const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_HOST = isLocal
  ? `${window.location.protocol}//${window.location.hostname}`
  : `${window.location.origin}`;

export const TEAM_CODE = "pl1";

export const apiBaseUrl = `${API_HOST}/intproj25/${TEAM_CODE}/itb-ecors/api/v1`;
