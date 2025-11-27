import { updateSession } from "./lib/middleware";

export async function middleware(request) {
  const url = request.nextUrl.pathname;

  // 1) Webhook URL — login talab qilmaydi
  if (url.startsWith("/api/amocrm-webhook")) {
    return; // hech narsa qilmaydi → to'g'ridan-to'g'ri route.js ishlaydi
  }

  // 2) Boshqa barcha URLlar uchun authentifikatsiya
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
