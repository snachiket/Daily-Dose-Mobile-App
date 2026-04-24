# Daily Dose

Cross-platform mobile app (iPhone + Android) that helps you practice the virtues you care about — one day at a time.

Subscribe to categories like **Leadership**, **Assertiveness**, **Quality**, **Large Life**, **Commitment**, **Gratitude**, or **Discipline**. Every day, each subscribed category shows:

1. A motivational **quote**.
2. A concrete **task** to re-assert the virtue.
3. A **journal** space to record your thoughts for the day.

Built with [Expo](https://expo.dev) + React Native, so one codebase runs on both iOS and Android. You can develop it from a **Windows laptop** without a Mac — see below.

## Project layout

```
app/                             # expo-router (file-based routing)
├── _layout.tsx                  # root providers
└── (tabs)/
    ├── _layout.tsx              # tab bar
    ├── index.tsx                # Today
    ├── categories.tsx           # Categories subscriptions
    └── journal.tsx              # Journal history
src/
├── components/
│   └── DailyCategoryCard.tsx
├── data/
│   ├── content.ts               # Loads content.json + picks daily entry
│   ├── SubscriptionStore.tsx    # React context, AsyncStorage-backed
│   └── JournalStore.tsx         # React context, AsyncStorage-backed
├── models/types.ts
└── theme.ts
assets/
└── content.json                 # Structured quotes + tasks (edit freely)
app.json                         # Expo config
eas.json                         # EAS Build profiles
```

## Prerequisites (Windows or anywhere)

- **Node.js 20+** and **npm** (or yarn / pnpm).
- **Git**.
- An **iPhone** (iOS 17+) and/or **Android phone** (Android 7+).
- Install the free **Expo Go** app on each phone from the App Store / Play Store.
- Optional for standalone builds: a free [Expo account](https://expo.dev) for [EAS Build](https://docs.expo.dev/build/introduction/).

## Get it running in Expo Go (fastest path)

1. Clone and install:
   ```sh
   git clone <your-fork-url>
   cd Daily-Dose-Mobile-App
   npm install
   ```
2. Start the dev server:
   ```sh
   npx expo start
   ```
3. On your phone, open **Expo Go** and scan the QR code shown in the terminal. The app loads over Wi-Fi — no build needed. Save any file on your laptop and the phone hot-reloads.

Your phone and laptop must be on the same Wi-Fi network. If they're not, press `s` in the Expo CLI to toggle *Tunnel* mode.

## Install as a standalone app on your iPhone and Android

Expo Go is great for development. For a real installable app that opens from your home screen, use **EAS Build**.

### One-time setup

```sh
npm install -g eas-cli
eas login                # create a free account if you don't have one
eas build:configure      # already configured via eas.json; just confirms the project id
```

### Android APK (any Windows laptop can do this)

```sh
eas build -p android --profile preview
```

EAS runs the build in the cloud and gives you a download link. Transfer the `.apk` to your phone (email, Drive, USB), enable *Install unknown apps*, and tap it.

### iOS IPA (Windows-friendly, no Mac required)

```sh
eas build -p ios --profile preview
```

On the first run EAS will:
- Ask you to log into your Apple ID.
- Register your iPhone's UDID as a test device (it sends you a link to install a provisioning profile — open it on your phone).
- Handle certificates and signing in the cloud.

When the build is done, EAS gives you an install page URL. Open it on your iPhone in Safari and tap **Install**.

With a **free Apple ID** the signed build works for **7 days**, then it silently stops launching. Re-run `eas build -p ios --profile preview` to refresh. If you later join the Apple Developer Program ($99/year), signed builds are valid for a year and you can use TestFlight.

## Editing the structured content

All quotes and tasks live in `assets/content.json`. Schema:

```json
{
  "schemaVersion": 1,
  "categories": [
    {
      "id": "leadership",
      "name": "Leadership",
      "summary": "Guide, inspire, and serve others.",
      "iconName": "people",
      "entries": [
        { "quote": "...", "author": "...", "task": "..." }
      ]
    }
  ]
}
```

- `id` must be stable and unique; subscriptions are keyed off it.
- `iconName` must be a valid [Ionicons](https://ionic.io/ionicons) name — used by `@expo/vector-icons`.
- `entries` can be any length. The app deterministically picks one per day per category, so adding more variety is as simple as appending more entries.
- Save the file; Expo Go hot-reloads instantly. For standalone builds, re-run `eas build`.

## Persistence

- **Subscriptions** are stored in `AsyncStorage` under `DailyDose.subscribedCategoryIds`.
- **Journal entries** are stored in `AsyncStorage` under `DailyDose.journal.v1`. Each entry is keyed by `categoryId|YYYY-MM-DD`.
- Uninstalling the app clears both. iCloud/Google backups can be added later.

## Common issues

- **Expo Go can't connect** — make sure phone + laptop are on the same Wi-Fi (not guest/isolated network). Press `s` to switch to *Tunnel* mode.
- **EAS iOS build asks for Apple Developer Program** — you can choose an ad-hoc build with a free Apple ID when prompted. Your device must be registered by its UDID.
- **`npm install` warns about peer deps** — run `npx expo install --fix` once to align package versions with the Expo SDK.

## Roadmap ideas

- Local notifications (via `expo-notifications`) to nudge you each morning per category.
- Streak tracking and gentle reminders for skipped days.
- Cloud sync for journal entries (Supabase / Firebase / iCloud Drive).
- Remote content refresh — pull an updated `content.json` from a URL on launch.
