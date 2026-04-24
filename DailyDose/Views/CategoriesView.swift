import SwiftUI

struct CategoriesView: View {
    @EnvironmentObject var library: ContentLibrary
    @EnvironmentObject var subscriptions: SubscriptionStore

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("Subscribe to the virtues you want to practice daily. Each category will show a quote, a task, and a journal prompt every day.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                Section("Available") {
                    ForEach(library.categories) { category in
                        HStack(spacing: 12) {
                            Image(systemName: category.symbolName)
                                .foregroundStyle(.tint)
                                .frame(width: 28)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(category.name).font(.body)
                                Text(category.summary).font(.caption).foregroundStyle(.secondary)
                            }
                            Spacer()
                            Toggle(
                                "",
                                isOn: Binding(
                                    get: { subscriptions.isSubscribed(category.id) },
                                    set: { _ in subscriptions.toggle(category.id) }
                                )
                            )
                            .labelsHidden()
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .navigationTitle("Categories")
        }
    }
}
