# RadTom – strona i panel administratora

Statyczna strona (GitHub Pages) + Firebase (logowanie Google i baza Firestore). Treści edytujesz w panelu: otwórz stronę z `#admin` na końcu adresu i zaloguj się kontem Google.

## Struktura
- `index.html`, `css/`, `js/` – strona i panel (`js/admin.js` ładuje się tylko po wejściu w panel)
- `js/config.js` – konfiguracja Firebase i adres strony (`SITE_URL`)
- `firestore.rules` – reguły bazy (wklej w Firebase → Firestore → Rules → Publish)
- `polityka-prywatnosci.html`, `404.html` – strony pomocnicze (dane firmy z panelu)
- `kategoria/`, `produkt/`, `images/produkty/`, `sitemap.xml`, `llms.txt`, `api/produkty.json` – **generowane** (patrz niżej)
- `narzedzia/` – skrypty pomocnicze (Python 3, bez dodatkowych bibliotek)

## Po dodaniu lub zmianie produktów (SEO)
Strona główna działa od razu po zapisie w panelu. Osobne podstrony kategorii i produktów (widoczne w Google) powstają tak:
1. Panel → **Narzędzia i SEO** → "Pobierz oferta.json".
2. Zapisz plik jako `narzedzia/oferta.json`.
3. W katalogu głównym repozytorium: `python narzedzia/gen-strony.py`
4. Wrzuć na GitHub zmienione pliki (commit + push lub "Upload files").

## Zmiana adresu po zakupie domeny
`python narzedzia/ustaw-domene.py https://twojadomena.pl`, potem `python narzedzia/gen-strony.py`.
Następnie: GitHub → Settings → Pages → Custom domain oraz Firebase → Authentication → Settings → Authorized domains (dodaj domenę).

## Dodanie administratora
Najłatwiej w panelu: Narzędzia i SEO → Administratorzy (wpisz Gmail). Pierwszego admina zakłada się ręcznie: Firebase → Firestore → kolekcja `admins` → dokument o ID = adres Gmail małymi literami, dowolne pole (np. `rola` = `admin`).
