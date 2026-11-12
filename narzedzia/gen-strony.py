#!/usr/bin/env python3
"""RadTom: generator stron kategorii i produktów oraz plików SEO.

Użycie (w katalogu głównym repozytorium):
  1. W panelu administratora: Narzędzia i SEO -> "Pobierz oferta.json".
  2. Zapisz plik jako narzedzia/oferta.json.
  3. python narzedzia/gen-strony.py
  4. Wrzuć na GitHub zmienione i nowe pliki (kategoria/, produkt/, images/produkty/,
     api/produkty.json, sitemap.xml, llms.txt).

Skrypt używa tylko biblioteki standardowej Pythona (3.8+). Adres strony bierze z js/config.js (SITE_URL).
"""
import base64, datetime, html, json, pathlib, re, shutil, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "narzedzia" / "oferta.json"

def esc(s): return html.escape(str(s if s is not None else ""), quote=True)

def slugify(s):
    s = str(s).lower().replace("ł", "l").replace("ø", "o")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "produkt"

def site_url():
    m = re.search(r'SITE_URL\s*=\s*"([^"]+)"', (ROOT / "js" / "config.js").read_text(encoding="utf-8"))
    if not m: sys.exit("Nie znaleziono SITE_URL w js/config.js")
    return m.group(1).rstrip("/")

DOOR = '<svg width="30" height="30" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="5" fill="none" stroke="#d4b176" stroke-width="1.5"/><rect x="10" y="6" width="12" height="20" fill="none" stroke="#d4b176" stroke-width="2"/><circle cx="19" cy="17" r="1.4" fill="#d4b176"/></svg>'
PLACEHOLDER = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">'
  '<stop offset="0" stop-color="#1b2f4f"/><stop offset="1" stop-color="#0c1829"/></linearGradient></defs><rect width="400" height="460" fill="url(#g)"/>'
  '<rect x="128" y="60" width="144" height="340" fill="#12213a" stroke="#d4b176" stroke-width="3"/>'
  '<rect x="146" y="82" width="108" height="140" fill="none" stroke="#d4b176" stroke-opacity=".5"/>'
  '<rect x="146" y="240" width="108" height="140" fill="none" stroke="#d4b176" stroke-opacity=".5"/><circle cx="250" cy="232" r="6" fill="#d4b176"/></svg>')

def tel(p): return "tel:" + re.sub(r"[^\d+]", "", p)
def clip(s, n=155):
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    return s if len(s) <= n else s[: n - 1].rsplit(" ", 1)[0] + "…"

def main():
    if not SRC.exists(): sys.exit("Brak pliku narzedzia/oferta.json. Pobierz go z panelu: Narzędzia i SEO -> Pobierz oferta.json")
    data = json.loads(SRC.read_text(encoding="utf-8"))
    M = data.get("main", {}); prods = [p for p in data.get("products", []) if p.get("visible", True)]
    prods.sort(key=lambda p: (p.get("order") or 0, p.get("name", "")))
    URL = site_url(); today = datetime.date.today().isoformat(); year = datetime.date.today().year
    brand = M.get("brand") or "RadTom"; old = M.get("oldName") or ""; phone = M.get("phone") or ""; email = M.get("email") or ""
    since = M.get("since") or year; years = year - int(since)
    credit = M.get("credit", "Strona wykonana przez Radosław Jaskuła (Procix94)")
    credit_html = f'<br><small class="credit">{esc(credit)}</small>' if credit else ""
    subtitle = "Drzwi przeciwpożarowe" + (f" · dawniej {esc(old)}" if old else "")

    # kategorie: najpierw z ustawień (Nazwa | opis), potem te występujące tylko w produktach
    cats, seen = [], set()
    for line in M.get("categories", []):
        name, _, desc = str(line).partition("|"); name, desc = name.strip(), desc.strip()
        if name and name not in seen: cats.append({"name": name, "desc": desc}); seen.add(name)
    for p in prods:
        c = p.get("category")
        if c and c not in seen: cats.append({"name": c, "desc": ""}); seen.add(c)
    cats = [c for c in cats if any(p.get("category") == c["name"] for p in prods)]
    used = set()
    for c in cats: c["slug"] = slugify(c["name"])
    for p in prods:
        base = slugify(p.get("name")); s, n = base, 2
        while s in used: s = f"{base}-{n}"; n += 1
        used.add(s); p["slug"] = s

    # katalogi wynikowe (tylko te generowane)
    for d in ("kategoria", "produkt"): shutil.rmtree(ROOT / d, ignore_errors=True)
    imgdir = ROOT / "images" / "produkty"; shutil.rmtree(imgdir, ignore_errors=True); imgdir.mkdir(parents=True, exist_ok=True)
    (ROOT / "images" / "placeholder-drzwi.svg").write_text(PLACEHOLDER, encoding="utf-8")
    for p in prods:
        m = re.match(r"data:image/\w+;base64,(.*)", p.get("thumb") or "", re.S)
        p["img"] = None
        if m:
            (imgdir / f"{p['slug']}.jpg").write_bytes(base64.b64decode(m.group(1))); p["img"] = f"images/produkty/{p['slug']}.jpg"

    def call_btn(cls="gold", txt=None):
        return f'<a class="btn {cls}" href="{tel(phone)}">{esc(txt or "Zadzwoń: " + phone)}</a>' if phone else ""

    def shell(title, desc, path, depth, body, ld=None, og_img=None):
        rel = "../" * depth; canon = f"{URL}/{path}"
        img = f"{URL}/{og_img}" if og_img else f"{URL}/og-image.jpg"
        lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
        return f"""<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website"><meta property="og:site_name" content="{esc(brand)}"><meta property="og:locale" content="pl_PL">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{canon}"><meta property="og:image" content="{img}">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#12213a">
{lds}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2312213a'/%3E%3Crect x='10' y='5' width='12' height='22' fill='none' stroke='%23d4b176' stroke-width='2'/%3E%3Ccircle cx='19' cy='17' r='1.4' fill='%23d4b176'/%3E%3C/svg%3E">
<link rel="stylesheet" href="{rel}css/site.css?v=11122040">
</head><body>
<header class="hd"><div class="wrap"><a class="logo" href="{rel or './'}">{DOOR}<span><b>{esc(brand.upper())}</b><small>{subtitle}</small></span></a>
<div class="hd-r"><a href="{rel}#oferta">Oferta</a><a href="{rel}#kontakt">Kontakt</a>{call_btn('gold sm', 'Zadzwoń')}</div></div></header>
{body}
<footer><div class="wrap"><span>© {year} {esc(brand)}{f' (dawniej {esc(old)})' if old else ''}{credit_html}</span><span><a href="{rel}polityka-prywatnosci.html">Polityka prywatności</a><a href="{rel}#admin">Panel administratora</a></span></div></footer>
<div id="mbar">{call_btn('gold', 'Zadzwoń i zamów')}</div>
</body></html>
"""

    def dims_html(p):
        v = (p.get("variants") or [])[:1]
        if not v: return ""
        v = v[0]; rows = []
        if v.get("leafW") or v.get("leafH"): rows.append(("Skrzydło (szer. × wys.)", f"{esc(v.get('leafW') or '–')} × {esc(v.get('leafH') or '–')} mm"))
        if v.get("mountW") or v.get("mountH"): rows.append(("Wymiar montażowy", f"{esc(v.get('mountW') or '–')} × {esc(v.get('mountH') or '–')} mm"))
        if len(p.get("variants") or []) > 1: rows.append(("Dostępne warianty", f"{len(p['variants'])} wymiary"))
        return '<dl class="dims">' + "".join(f"<div><dt>{a}</dt><dd>{b}</dd></div>" for a, b in rows) + "</dl>" if rows else ""

    def card(p, rel):
        img = p["img"] or "images/placeholder-drzwi.svg"
        return (f'<a class="card" href="{rel}produkt/{p["slug"]}/"><div class="ph"><img src="{rel}{img}" alt="{esc(p["name"])}" loading="lazy">'
                + (f'<span class="bdg">{esc(p["badge"])}</span>' if p.get("badge") else "") +
                f'</div><div class="cb"><div class="cat">{esc(p.get("category",""))}</div><h3>{esc(p["name"])}</h3><p>{esc(p.get("short",""))}</p>{dims_html(p)}'
                f'<div class="ca"><span class="btn sm line">Szczegóły</span></div></div></a>')

    cat_by_name = {c["name"]: c for c in cats}
    breadcrumbs = lambda items: {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}

    # --- strony produktów ---
    for p in prods:
        c = cat_by_name.get(p.get("category")); rel = "../../"; img = p["img"] or "images/placeholder-drzwi.svg"
        vs = p.get("variants") or []; named = any(v.get("name") for v in vs)
        dimtbl = ""
        if vs:
            dimtbl = "<h2>Wymiary (mm)</h2><table class='t'><tr>" + ("<th>Wariant</th>" if named else "") + "<th>Skrzydło szer.</th><th>Skrzydło wys.</th><th>Montaż szer.</th><th>Montaż wys.</th>" + ("<th>Cena</th>" if any(v.get("price") for v in vs) else "") + "</tr>" + "".join(
                "<tr>" + (f"<td>{esc(v.get('name'))}</td>" if named else "") + f"<td>{esc(v.get('leafW') or '–')}</td><td>{esc(v.get('leafH') or '–')}</td><td>{esc(v.get('mountW') or '–')}</td><td>{esc(v.get('mountH') or '–')}</td>" + (f"<td>{esc(v.get('price') or '–')}</td>" if any(x.get('price') for x in vs) else "") + "</tr>" for v in vs) + "</table>"
        spec = ("<h2>Parametry</h2><table class='t kv'>" + "".join(f"<tr><th>{esc(s['k'])}</th><td>{esc(s['v'])}</td></tr>" for s in p.get("specs") or []) + "</table>") if p.get("specs") else ""
        def docurl(u):
            u = str(u or "").strip()
            return u if re.match(r"https?://", u) else (rel + u.lstrip("./").lstrip("/")) if u else ""
        dl = [(d.get("name") or "Dokument", docurl(d.get("url"))) for d in p.get("docs") or [] if d.get("url") and re.match(r"^(https?://|/|\./|[\w-]+[\w./-]*\.pdf)", str(d["url"]).strip(), re.I)]
        docs = ("<h2>Do pobrania</h2><div class='docs'>" + "".join(f'<a href="{esc(u)}" rel="noopener">{esc(n)}</a>' for n, u in dl) + "</div>") if dl else ""
        others = [q for q in prods if q is not p and q.get("category") == p.get("category")][:4]
        more = ('<h2>Inne w tej kategorii</h2><div class="filters" style="margin:10px 0 0">' + "".join(f'<a class="chip" href="{rel}produkt/{q["slug"]}/">{esc(q["name"])}</a>' for q in others) + "</div>") if others else ""
        crumb = f'<a href="{rel}">Strona główna</a> › ' + (f'<a href="{rel}kategoria/{c["slug"]}/">{esc(c["name"])}</a> › ' if c else "") + esc(p["name"])
        mail = f'<a class="btn line" href="mailto:{esc(email)}?subject={esc("Zapytanie: " + p["name"])}">Wyślij zapytanie e-mail</a>' if email else ""
        body = (f'<main class="pg"><div class="wrap"><div class="crumb">{crumb}</div><div class="pgrid"><div class="pimg"><img src="{rel}{img}" alt="{esc(p["name"])}"></div>'
                f'<div class="pinfo"><div class="cat">{esc(p.get("category",""))}</div><h1>{esc(p["name"])}</h1>'
                f'<div class="price">{esc(p["price"]) if p.get("price") else "Cena: zapytaj telefonicznie"}</div><div class="desc">{esc(p.get("desc") or p.get("short") or "")}</div>'
                f'{dimtbl}{spec}{docs}<div class="mcta">{call_btn("gold", "Zadzwoń i zamów: " + phone)}{mail}</div>{more}</div></div></div></main>')
        url = f"{URL}/produkt/{p['slug']}/"
        prod_ld = {"@context": "https://schema.org", "@type": "Product", "name": p["name"], "description": clip(p.get("desc") or p.get("short"), 500),
                   "category": p.get("category", ""), "brand": {"@type": "Brand", "name": brand}, "url": url}
        if p["img"]: prod_ld["image"] = [f"{URL}/{p['img']}"]
        trail = [("Strona główna", URL + "/")] + ([(c["name"], f"{URL}/kategoria/{c['slug']}/")] if c else []) + [(p["name"], url)]
        out = ROOT / "produkt" / p["slug"]; out.mkdir(parents=True, exist_ok=True)
        (out / "index.html").write_text(shell(f"{p['name']} | Drzwi przeciwpożarowe {brand}", clip(p.get("desc") or p.get("short") or p["name"]) or p["name"],
                                              f"produkt/{p['slug']}/", 2, body, [prod_ld, breadcrumbs(trail)], p["img"]), encoding="utf-8")

    # --- strony kategorii ---
    for c in cats:
        rel = "../../"; items = [p for p in prods if p.get("category") == c["name"]]
        h1 = c["name"] if "drzw" in c["name"].lower() else "Drzwi " + c["name"].lower()
        intro = c["desc"] or f"Modele z kategorii {c['name'].lower()} w ofercie {brand}. Przy każdym podajemy wymiary skrzydła i wymiary montażowe."
        others = "".join(f'<a class="chip" href="{rel}kategoria/{o["slug"]}/">{esc(o["name"])}</a>' for o in cats if o is not c)
        body = (f'<main class="pg"><div class="wrap"><div class="crumb"><a href="{rel}">Strona główna</a> › {esc(c["name"])}</div><h1>{esc(h1)}</h1>'
                f'<p class="lead">{esc(intro)}</p><div class="grid" style="margin-top:34px">{"".join(card(p, rel) for p in items)}</div>'
                f'<div class="filters"><span class="a-mut" style="align-self:center;color:var(--steel)">Pozostałe kategorie:</span>{others}</div>'
                f'<p class="lead" style="margin-top:14px">Nie widzisz modelu, którego szukasz? {("Zadzwoń: " + esc(phone) + ". ") if phone else ""}Dobierzemy drzwi do Twojego otworu.</p></div></main>')
        trail = [("Strona główna", URL + "/"), (c["name"], f"{URL}/kategoria/{c['slug']}/")]
        lst = {"@context": "https://schema.org", "@type": "ItemList", "name": h1, "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "url": f"{URL}/produkt/{p['slug']}/", "name": p["name"]} for i, p in enumerate(items)]}
        out = ROOT / "kategoria" / c["slug"]; out.mkdir(parents=True, exist_ok=True)
        (out / "index.html").write_text(shell(f"{h1} – oferta | {brand}", clip(intro), f"kategoria/{c['slug']}/", 2, body, [lst, breadcrumbs(trail)],
                                              items[0]["img"] if items and items[0]["img"] else None), encoding="utf-8")

    # --- sitemap.xml ---
    urls = [(f"{URL}/", "1.0", "weekly"), (f"{URL}/polityka-prywatnosci.html", "0.3", "yearly")] + \
           [(f"{URL}/kategoria/{c['slug']}/", "0.8", "weekly") for c in cats] + [(f"{URL}/produkt/{p['slug']}/", "0.7", "monthly") for p in prods]
    (ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
        f"  <url><loc>{u}</loc><lastmod>{today}</lastmod><changefreq>{f}</changefreq><priority>{pr}</priority></url>\n" for u, pr, f in urls) + "</urlset>\n", encoding="utf-8")

    # --- api/produkty.json ---
    (ROOT / "api").mkdir(exist_ok=True)
    api = {"firma": {"nazwa": brand, "dawna_nazwa": old, "od_roku": since, "telefon": phone, "email": email, "adres": M.get("address", ""), "strona": URL + "/"},
           "kategorie": [{"nazwa": c["name"], "slug": c["slug"], "opis": c["desc"], "url": f"kategoria/{c['slug']}/", "adres": f"{URL}/kategoria/{c['slug']}/"} for c in cats],
           "produkty": [{"id": p.get("id"), "slug": p["slug"], "nazwa": p["name"], "kategoria": p.get("category", ""), "opis_krotki": p.get("short", ""), "opis": p.get("desc", ""),
                         "cena": p.get("price", ""), "warianty": [{"nazwa": v.get("name", ""), "szerokosc_skrzydla_mm": v.get("leafW", ""), "wysokosc_skrzydla_mm": v.get("leafH", ""),
                                                                   "szerokosc_montazowa_mm": v.get("mountW", ""), "wysokosc_montazowa_mm": v.get("mountH", ""), "cena": v.get("price", "")} for v in p.get("variants") or []],
                         "parametry": [{"nazwa": s["k"], "wartosc": s["v"]} for s in p.get("specs") or []], "url": f"produkt/{p['slug']}/", "adres": f"{URL}/produkt/{p['slug']}/",
                         "zdjecie": f"{URL}/{p['img']}" if p["img"] else ""} for p in prods]}
    (ROOT / "api" / "produkty.json").write_text(json.dumps(api, ensure_ascii=False, indent=1), encoding="utf-8")

    # --- llms.txt ---
    lines = [f"# {brand}" + (f" (dawniej {old})" if old else ""), "",
             f"> Sprzedaż drzwi przeciwpożarowych (jedno- i dwuskrzydłowych, przeszklonych, dymoszczelnych) od {years} lat. Przy każdym modelu podane są wymiary skrzydła i wymiary montażowe. Zamówienia telefoniczne.", ""]
    if phone: lines.append(f"- Telefon (zamówienia): {phone}")
    if email: lines.append(f"- E-mail: {email}")
    if M.get("address"): lines.append(f"- Adres: {M['address']}")
    lines += [f"- Strona: {URL}/", f"- Dane maszynowe: {URL}/api/produkty.json", "", "## Kategorie"]
    lines += [f"- [{c['name']}]({URL}/kategoria/{c['slug']}/)" + (f": {c['desc']}" if c["desc"] else "") for c in cats]
    lines += ["", "## Produkty"] + [f"- [{p['name']}]({URL}/produkt/{p['slug']}/)" + (f": {clip(p.get('short'), 140)}" if p.get("short") else "") for p in prods]
    (ROOT / "llms.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Gotowe: {len(cats)} kategorii, {len(prods)} produktów. Adres: {URL}")

if __name__ == "__main__":
    main()
