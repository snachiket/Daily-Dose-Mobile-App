import SwiftUI

struct RootView: View {
    @EnvironmentObject var subscriptions: SubscriptionStore

    var body: some View {
        TabView {
            TodayView()
                .tabItem {
                    Label("Today", systemImage: "sun.max")
                }

            CategoriesView()
                .tabItem {
                    Label("Categories", systemImage: "square.grid.2x2")
                }
                .badge(subscriptions.subscribedIds.isEmpty ? "!" : nil)

            JournalHistoryView()
                .tabItem {
                    Label("Journal", systemImage: "book")
                }
        }
    }
}
