// auth/keycloak.js
import { TEAM_CODE } from "../config/api.js";

export const keycloak = new Keycloak({
  url: `https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/`,
  realm: "itb-ecors",
  clientId: "itb-ecors-pl1",
});

export async function initAuth(onLogin) {
  const auth = await keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
  });

  if (!auth) return;

  const studentId = keycloak.tokenParsed.preferred_username;
  const token = keycloak.token;

  const logout = () => {
    const home = `${window.location.origin}/intproj25/${TEAM_CODE}/itb-ecors/`;
    keycloak.logout({ redirectUri: home });
  };

  onLogin({ studentId, token, logout });
}
