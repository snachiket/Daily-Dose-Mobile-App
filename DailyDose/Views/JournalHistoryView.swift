import SwiftUI

struct JournalHistoryView: View {
    @EnvironmentObject var library: ContentLibrary
    @EnvironmentObject var journal: JournalStore

    var body: some View {
        NavigationStack {
            Group {
                let groups = journal.entriesByDate()
                if groups.isEmpty {
                    ContentUnavailableView(
                        "No journal entries yet",
                        systemImage: "book.closed",
                        description: Text("Your reflections will appear here once you start writing in the Today tab.")
                    )
                } else {
                    List {
                        ForEach(groups, id: \.dateKey) { group in
                            Section(displayDate(group.dateKey)) {
                                ForEach(group.items) { entry in
                                    VStack(alignment: .leading, spacing: 6) {
                                        HStack(spacing: 8) {
                                            if let category = library.category(id: entry.categoryId) {
                                                Image(systemName: category.symbolName)
                                                    .foregroundStyle(.tint)
                                                Text(category.name).font(.subheadline).bold()
                                            } else {
                                                Text(entry.categoryId).font(.subheadline).bold()
                                            }
                                        }
                                        Text(entry.text)
                                            .font(.body)
                                            .foregroundStyle(.primary)
                                    }
                                    .padding(.vertical, 4)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Journal")
        }
    }

    private func displayDate(_ key: String) -> String {
        let input = DateFormatter()
        input.dateFormat = "yyyy-MM-dd"
        input.locale = Locale(identifier: "en_US_POSIX")
        guard let date = input.date(from: key) else { return key }
        let output = DateFormatter()
        output.dateStyle = .full
        output.timeStyle = .none
        return output.string(from: date)
    }
}
