# UWAGA!
# Nie jestem właścicielem wideo ani ścieżek dźwiękowych umieszczonych w repozytorium. Jest nim producent gier planszowych TREFL. Użyłem ich ze względu na chęć zbliżenia gry do pierwowzoru, który był dostępny na płycie DVD.
## Gra rozszerzona jest o pytania generowane przez AI, dlatego pytania nie powtarzają się, co sprawia że gra wolniej się nudzi, a także daje to okazję do nauczenia się nowych rzeczy. Do zagrania w grę potrzebna jest plansza oraz dostęp aplikacji do internetu!

## Wymagania
- Node.js (v20.16.0) - https://nodejs.org/en
- npm (10.9.0)
- git/można także pobrać grę w formacie zip z repozytorium - https://git-scm.com/

## Instalacja
### 1. Zainstaluj Node.js oraz git z linków podanych powyżej
### 2. Sklonuj repozytorium / pobierz skompresowaną wersję gry
- Przejdź do katalogu, do którego chcesz sklonować repozytorium
- Wpisz w git bashu lub wierszu poleceń, polecenie: git clone https://github.com/KVrotek/skarb_zakonu.git
  /////////////////////////////////////////////////////////////////////////////////////////////////////
- Pobierz skompresowaną zawartość repozytorium 
- Wypakuj pliki gry do katalogu w którym chcesz, aby się ona znajdowała
### 3. Uzyskaj dostęp do klucza API z Google AI Studio
- Przejdź na stronę https://ai.google.dev/
- Kliknij na przycisk "Uzyskiwanie klucza interfejsu API z Google AI Studio"
- Zaloguj się przez konto google
- Kliknij na przycisk "Get API key", a następnie na "Create API key"
- Skopiuj utworzony klucz
- W plikach gry znajdź ".env", otwórz go za pomocą edytora tekstu, a następnie zamień sekcje YOUR_GEMINI_API_KEY na skopiowany przez ciebie klucz
### 4. Instalacja zależności
- Otwórz git bash/wiersz poleceń i przejdź do katalogu z plikami
- Wywołaj polecenie npm install i zaczekaj aż wszystkie zależności zostaną zainstalowane
### 5. Uruchamianie gry
- Otwórz git bash/wiersz poleceń i przejdź do katalogu z plikami
- Wywołaj polecenie npm start
- Po chwili powinny wyświetlić się 2 linki, kliknij jeden z nich
- Po załadowaniu strony w przeglądarce kliknij przycisk rozpocznij
