import SwiftUI

@main
struct DailyDoseApp: App {
    @StateObject private var library = ContentLibrary.live
    @StateObject private var subscriptions = SubscriptionStore()
    @StateObject private var journal = JournalStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(library)
                .environmentObject(subscriptions)
                .environmentObject(journal)
        }
    }
}
