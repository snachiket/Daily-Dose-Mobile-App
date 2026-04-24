import SwiftUI

struct TodayView: View {
    @EnvironmentObject var library: ContentLibrary
    @EnvironmentObject var subscriptions: SubscriptionStore
    @EnvironmentObject var journal: JournalStore

    private let today = Date()

    var subscribedCategories: [Category] {
        library.categories.filter { subscriptions.isSubscribed($0.id) }
    }

    var body: some View {
        NavigationStack {
            Group {
                if subscribedCategories.isEmpty {
                    EmptyStateView()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 20) {
                            ForEach(subscribedCategories) { category in
                                DailyCategoryCard(category: category, date: today)
                            }
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle(title)
        }
    }

    private var title: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMM d"
        return formatter.string(from: today)
    }
}

private struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "sun.max.trianglebadge.exclamationmark")
                .font(.system(size: 56))
                .foregroundStyle(.secondary)
            Text("No subscriptions yet")
                .font(.title2)
                .bold()
            Text("Open the Categories tab and subscribe to the virtues you want to practice daily.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 40)
        }
        .padding()
    }
}
