/* RadTom: wysyłanie SMS-a na Twój telefon po każdym zapytaniu z formularza.
 *
 * Strona działa bez serwera, a SMS-a nie da się bezpiecznie wysłać wprost z przeglądarki (klucz byłby widoczny dla każdego).
 * Dlatego potrzebny jest mały pośrednik. To jest gotowy kod dla darmowego Cloudflare Workers + bramki SMSAPI (https://www.smsapi.pl).
 *
 * Konfiguracja (jednorazowo, ok. 15 minut):
 *  1. Załóż konto w SMSAPI, doładuj kilka SMS-ów i w panelu wygeneruj token OAuth z uprawnieniem "SMS".
 *  2. Załóż darmowe konto Cloudflare -> Workers & Pages -> Create -> "Hello World" -> Deploy -> Edit code.
 *  3. Wklej cały ten plik w miejsce kodu i zapisz (Deploy).
 *  4. Workers -> Settings -> Variables and Secrets dodaj:
 *       SMSAPI_TOKEN  (Secret)  = token z SMSAPI
 *       OWNER_PHONE   (Text)    = Twój numer w formacie 48XXXXXXXXX (9 cyfr po 48)
 *       ALLOWED_ORIGIN (Text)   = adres strony, np. https://procix95.github.io
 *  5. Skopiuj adres workera (np. https://radtom-sms.twojanazwa.workers.dev) i wklej w panelu strony:
 *       Dane i teksty -> "Adres webhooka do powiadomień SMS".
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*" };
    if (request.method === "OPTIONS") return new Response(null, { headers: { ...cors, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } });
    if (request.method !== "POST") return new Response("OK", { headers: cors });
    if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) return new Response("Forbidden", { status: 403 });

    let d;
    try { d = JSON.parse(await request.text()); } catch { return new Response("Bad request", { status: 400, headers: cors }); }
    const phone = String(d.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
    if (phone.replace(/\D/g, "").length < 7) return new Response("Bad phone", { status: 400, headers: cors });

    const clean = (s, n) => String(s || "").replace(/[\r\n]+/g, " ").slice(0, n);
    const items = Array.isArray(d.items) ? d.items.slice(0, 5).map((x) => clean(x, 40)).join("; ") : "";
    const text = `Zapytanie RadTom: ${clean(d.name, 40)} tel. ${phone}${items ? ". " + items : ""}${d.msg ? ". " + clean(d.msg, 120) : ""}`.slice(0, 300);

    const res = await fetch("https://api.smsapi.com/sms.do", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.SMSAPI_TOKEN, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ to: env.OWNER_PHONE, message: text, format: "json", encoding: "utf-8" }),
    });
    return new Response(res.ok ? "sent" : "sms error", { status: res.ok ? 200 : 502, headers: cors });
  },
};
