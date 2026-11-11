#!/usr/bin/env python3
"""RadTom: wpisuje numer wersji do adresów plików CSS i JS (?v=...), żeby przeglądarki nie trzymały starej wersji strony.
Użycie: python narzedzia/wersja.py [numer]   (bez numeru: bieżąca data i godzina)
Uruchom po każdej zmianie w css/ lub js/, przed wrzuceniem na GitHub.
"""
import datetime, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
v = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now().strftime("%m%d%H%M")
PAT = re.compile(r"((?:css/(?:site|admin)\.css)|(?:\./(?:core|config|life|admin|extra)\.js)|(?:js/(?:site|page)\.js))(\?v=\w*)?(?=[\"'])")
n = 0
for f in list(ROOT.glob("*.html")) + list(ROOT.glob("js/*.js")) + list(ROOT.glob("narzedzia/gen-strony.py")) + list(ROOT.glob("kategoria/*/index.html")) + list(ROOT.glob("produkt/*/index.html")):
    s = f.read_text(encoding="utf-8")
    t = PAT.sub(lambda m: m.group(1) + "?v=" + v, s)
    if t != s: f.write_text(t, encoding="utf-8"); n += 1
print(f"Wersja {v} wpisana w {n} plikach")
