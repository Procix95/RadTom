#!/usr/bin/env python3
"""RadTom: podmienia adres strony w całym projekcie (po zakupie własnej domeny).

Użycie:  python narzedzia/ustaw-domene.py https://twojadomena.pl
Skrypt: zmienia SITE_URL i wszystkie adresy w plikach HTML/XML/TXT/JSON/JS, tworzy plik CNAME.
Potem: w GitHubie (Settings -> Pages -> Custom domain) wpisz domenę, w Firebase dodaj ją do Authorized domains
i uruchom python narzedzia/gen-strony.py (odświeży sitemap i adresy w podstronach).
"""
import pathlib, re, sys
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXT = {".html", ".xml", ".txt", ".json", ".js", ".md", ".webmanifest"}

if len(sys.argv) != 2 or not sys.argv[1].startswith("http"):
    sys.exit("Użycie: python narzedzia/ustaw-domene.py https://twojadomena.pl")
new = sys.argv[1].rstrip("/")
cfg = ROOT / "js" / "config.js"
m = re.search(r'SITE_URL\s*=\s*"([^"]+)"', cfg.read_text(encoding="utf-8"))
if not m: sys.exit("Nie znaleziono SITE_URL w js/config.js")
old = m.group(1).rstrip("/")
if old == new: sys.exit("Ten adres jest już ustawiony.")

changed = 0
for f in ROOT.rglob("*"):
    if not f.is_file() or ".git" in f.parts or f.suffix.lower() not in EXT: continue
    try: s = f.read_text(encoding="utf-8")
    except UnicodeDecodeError: continue
    if old in s:
        f.write_text(s.replace(old, new), encoding="utf-8"); changed += 1

host = urlparse(new)
cname = ROOT / "CNAME"
if host.path in ("", "/"): cname.write_text(host.netloc + "\n", encoding="utf-8")
elif cname.exists(): cname.unlink()
print(f"Zmieniono adres w {changed} plikach: {old} -> {new}")
print("Dalej: GitHub Settings -> Pages -> Custom domain; Firebase -> Authentication -> Authorized domains; potem gen-strony.py")
