# TrackTrail - Music Label Management App

## Opis projektu

TrackTrail to aplikacja do zarządzania wytwórnią muzyczną, która umożliwia artystom i użytkownikom zarządzanie albumami, sesjami studyjnymi oraz interakcję poprzez czat. Aplikacja oferuje różne funkcje w zależności od roli użytkownika (artysta lub użytkownik).

## Funkcje

### Dla artystów:
- **Zarządzanie profilem**: Edycja informacji o profilu, w tym zdjęcia profilowego i biografii.
- **Tworzenie albumów**: Dodawanie nowych albumów, w tym tytułu, gatunku, daty wydania oraz listy utworów.
- **Edycja albumów**: Aktualizacja istniejących albumów.
- **Usuwanie albumów**: Usuwanie albumów z bazy danych.
- **Planowanie sesji studyjnych**: Tworzenie nowych sesji studyjnych, w tym daty, szczegółów i czasu trwania.

### Dla użytkowników:
- **Przeglądanie albumów**: Przeglądanie dostępnych albumów i ich szczegółów.
- **Przeglądanie artystów**: Przeglądanie profili artystów.
- **Subskrypcje**: Subskrybowanie artystów w celu otrzymywania powiadomień o nowych albumach i sesjach studyjnych.
- **Czat**: Udział w czatach podczas sesji studyjnych.

## Struktura projektu
.env .gitignore api/ controllers/ album.controller.js auth.controller.js search.controller.js studio-session.controller.js user.controller.js middleware/ auth.js uploadFile.js models/ album.model.js studio-session.model.js user.model.js routes/ album.route.js auth.route.js search.route.js studio-session.route.js ... main.js notif_centre.js package.json plik_certyfikat plik_klucz public/ images/ js/ styles/ README.md run.sh views/ pages/ partials/ start.ejs



## Technologie

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: EJS, CSS, JavaScript
- **Autoryzacja**: Passport.js
- **Powiadomienia**: MQTT, Nodemailer

## Instalacja

1. Sklonuj repozytorium:
    ```sh
    git clone https://github.com/your-repo/tracktrail.git
    ```
2. Zainstaluj zależności:
    ```sh
    npm install
    ```
3. Skonfiguruj plik `.env`:
    ```env
    MONGODB_URL=your_mongodb_url
    PORT=your_port
    SESSION_SECRET=your_session_secret
    NOT_EMAIL=your_notification_email
    NOT_PASSWORD=your_notification_email_password
    ```
4. Uruchom aplikację:
    ```sh
    npm start
    ```

## Użycie

1. Zarejestruj się jako artysta lub użytkownik.
2. Zaloguj się do aplikacji.
3. Artysta może dodawać, edytować i usuwać albumy oraz planować sesje studyjne.
4. Użytkownik może przeglądać albumy, subskrybować artystów i uczestniczyć w czatach.

## Autorzy

- [Twoje Imię](https://github.com/your-profile)

## Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT.
