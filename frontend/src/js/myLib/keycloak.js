import Keycloak from "keycloak-js"

// สร้าง instance โดยชี้ไปที่ไฟล์ keycloak.json หรือกำหนดค่าเอง
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
});

// เริ่มการเชื่อมต่อ
async function initKeycloak() {
  try {
    const authenticated = await keycloak.init({ onLoad: "login-required" });
    
    if (authenticated) {
      console.log("Authenticated ✅");
      console.log("Token:", keycloak.token);
    } else {
      console.warn("Not authenticated ❌");
    }
    if (keycloak.authenticated) {
        // console.log(keycloak.tokenParsed.name);
        console.log("ชื่อผู้ใช้:", keycloak.tokenParsed.preferred_username);
        // console.log("อีเมล:", keycloak.tokenParsed.email);
        // console.log("สิทธิ์:", keycloak.tokenParsed.realm_access.roles);
        return keycloak.tokenParsed
    }
  } catch (err) {
    console.error("Keycloak init error:", err);
  }
}


function signOut() {
  if (!keycloak) {
    console.error("Keycloak instance is undefined!");
    return;
  }
  keycloak.logout({
    redirectUri: `https://bscit.sit.kmutt.ac.th/intproj25/pl1/itb-ecors/`, // import.meta.env.VITE_APP_URI
  });
}

export {initKeycloak , signOut}
