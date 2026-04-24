import SwiftUI

struct DailyCategoryCard: View {
    let category: Category
    let date: Date

    @EnvironmentObject var library: ContentLibrary
    @EnvironmentObject var journal: JournalStore

    @State private var journalText: String = ""
    @State private var taskDone: Bool = false
    @FocusState private var journalFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            header

            if let entry = library.entry(for: category, on: date) {
                quoteBlock(entry: entry)
                taskBlock(entry: entry)
                journalBlock
            } else {
                Text("No content available for this category yet.")
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color(.secondarySystemBackground))
        )
        .onAppear { journalText = journal.text(categoryId: category.id, date: date) }
    }

    private var header: some View {
        HStack(spacing: 12) {
            Image(systemName: category.symbolName)
                .font(.title2)
                .foregroundStyle(.tint)
                .frame(width: 36, height: 36)
                .background(Circle().fill(Color.tint.opacity(0.15)))
            VStack(alignment: .leading, spacing: 2) {
                Text(category.name).font(.headline)
                Text(category.summary).font(.caption).foregroundStyle(.secondary)
            }
        }
    }

    private func quoteBlock(entry: DailyEntry) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Label("Quote", systemImage: "quote.opening").font(.caption).foregroundStyle(.secondary)
            Text("\u{201C}\(entry.quote)\u{201D}")
                .font(.body)
                .italic()
            Text("— \(entry.author)")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private func taskBlock(entry: DailyEntry) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Label("Today's task", systemImage: "checkmark.circle").font(.caption).foregroundStyle(.secondary)
            Toggle(isOn: $taskDone) {
                Text(entry.task)
                    .strikethrough(taskDone, color: .secondary)
                    .foregroundStyle(taskDone ? .secondary : .primary)
            }
            .toggleStyle(.automatic)
        }
    }

    private var journalBlock: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Label("Journal", systemImage: "pencil.line").font(.caption).foregroundStyle(.secondary)
                Spacer()
                if journalFocused {
                    Button("Done") { journalFocused = false }
                        .font(.caption)
                }
            }
            TextEditor(text: $journalText)
                .focused($journalFocused)
                .frame(minHeight: 100)
                .padding(8)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(.separator), lineWidth: 1)
                )
                .onChange(of: journalText) { _, newValue in
                    journal.save(text: newValue, categoryId: category.id, date: date)
                }
            if journalText.isEmpty {
                Text("What does \(category.name.lowercased()) mean to you today?")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}

private extension Color {
    static var tint: Color { Color.accentColor }
}
