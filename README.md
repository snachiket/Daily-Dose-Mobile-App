# Daily Dose

A SwiftUI iPhone app that helps you practice the virtues you care about — one day at a time.

Subscribe to categories like **Leadership**, **Assertiveness**, **Quality**, **Large Life**, **Commitment**, **Gratitude**, or **Discipline**. Every day, each subscribed category shows you:

1. A motivational **quote**.
2. A concrete **task** to re-assert the virtue.
3. A **journal** space to record your thoughts for the day.

All content for quotes and tasks comes from a structured JSON file (`DailyDose/Resources/content.json`) so you can edit or extend it without touching code.

## Features

- Subscribe / unsubscribe from categories at any time. Choices persist across launches.
- The Today tab shows a daily card per subscribed category: quote, task, and journal.
- Journal entries are saved per category, per day, on-device under `Documents/journal.json`.
- Journal tab shows all past reflections grouped by date.
- Content rotates deterministically based on the day so every day looks fresh, and the same day looks the same if you reopen the app.

## Project layout

```
DailyDose/
├── DailyDoseApp.swift        # @main app entry
├── Info.plist
├── Assets.xcassets/          # AppIcon, AccentColor
├── Models/
│   ├── Category.swift
│   └── JournalEntry.swift
├── Data/
│   ├── ContentLibrary.swift  # Loads content.json
│   ├── SubscriptionStore.swift
│   └── JournalStore.swift
├── Resources/
│   └── content.json          # Structured quotes + tasks
└── Views/
    ├── RootView.swift
    ├── TodayView.swift
    ├── DailyCategoryCard.swift
    ├── CategoriesView.swift
    └── JournalHistoryView.swift
project.yml                   # XcodeGen project definition
```

## Requirements

- macOS with **Xcode 15** or newer (required to build any iPhone app).
- An **iPhone running iOS 17** or newer.
- A free **Apple ID** (no paid Developer Program required for personal installs — the app will need to be re-signed every 7 days with a free account).
- [XcodeGen](https://github.com/yonaskolb/XcodeGen) (recommended) to generate `DailyDose.xcodeproj` from `project.yml`:
  ```sh
  brew install xcodegen
  ```

## Generate the Xcode project

From the repo root on your Mac:

```sh
xcodegen generate
open DailyDose.xcodeproj
```

> Prefer not to install XcodeGen? See *Manual Xcode setup* below.

## Install on your iPhone

1. Plug your iPhone into your Mac with a cable and trust the computer.
2. In Xcode, open `DailyDose.xcodeproj`.
3. Select the **DailyDose** target → **Signing & Capabilities**. Under *Team*, pick your Apple ID (add one via *Xcode → Settings → Accounts* if needed).
4. Change the *Bundle Identifier* to something unique, e.g. `com.yourname.dailydose`. Free Apple IDs can't reuse `com.dailydose.app`.
5. At the top of the Xcode window, pick your iPhone from the device selector.
6. Press **⌘R** (or click ▶︎). Xcode will build, sign, and install the app on your phone.
7. On your iPhone: *Settings → General → VPN & Device Management*, trust your developer profile, then launch **Daily Dose** from the home screen.

Rebuild any time you want to update content or code. With a free Apple ID the signed build expires after 7 days — just hit ⌘R again to refresh it.

## Editing the structured content

All quotes and tasks live in `DailyDose/Resources/content.json`. Schema:

```json
{
  "schemaVersion": 1,
  "categories": [
    {
      "id": "leadership",
      "name": "Leadership",
      "summary": "Guide, inspire, and serve others.",
      "symbolName": "figure.2.and.child.holdinghands",
      "entries": [
        { "quote": "...", "author": "...", "task": "..." }
      ]
    }
  ]
}
```

- `id` must be stable and unique; subscriptions are keyed off of it.
- `symbolName` must be a valid [SF Symbols](https://developer.apple.com/sf-symbols/) name.
- `entries` can be as short or as long as you like. The app picks one per day deterministically from the list, so adding more variety is as simple as appending more entries.
- Save the file, rebuild (⌘R) and the new content is picked up.

## Manual Xcode setup (without XcodeGen)

1. Launch Xcode → *File → New → Project… → iOS → App*.
2. Product name `DailyDose`, Interface `SwiftUI`, Language `Swift`.
3. Delete the auto-generated `ContentView.swift` and `DailyDoseApp.swift`.
4. Drag the `DailyDose/` folder from this repo into the Xcode project navigator (choose *Copy items if needed* → *Create groups*).
5. Ensure `Resources/content.json` is part of the app target's *Copy Bundle Resources* phase.
6. In *Signing & Capabilities*, set your team and a unique bundle identifier, then build with ⌘R as above.

## Roadmap ideas

- Local notifications to nudge you each morning per category.
- Streak tracking and gentle reminders for skipped days.
- iCloud sync for journal entries across devices.
- Remote content refresh (pull a new `content.json` on app launch).
