// lib/amo.js

let cachedToken = null;
let tokenExpiresAt = 0; // timestamp

export async function getAmoAccessToken() {
  const now = Date.now();

  // Agar token hali amal qilsa, cache dan qaytaramiz
  if (cachedToken && now < tokenExpiresAt - 10000) {
    return cachedToken;
  }

  // Tokenni refresh qilamiz
  const res = await fetch("https://www.amocrm.ru/oauth2/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AMO_CLIENT_ID,
      client_secret: process.env.AMO_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: process.env.AMO_REFRESH_TOKEN,
      redirect_uri: process.env.AMO_REDIRECT_URI,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }

  // Yangi access token va refresh token
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  // Har safar refresh_token yangilanadi, uni saqlash kerak
  process.env.AMO_REFRESH_TOKEN = data.refresh_token; // runtime da saqladik
  // Ishonchli variant: DB yoki faylga saqlash

  return cachedToken;
}
