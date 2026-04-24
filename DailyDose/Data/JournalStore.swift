import Foundation
import Combine

final class JournalStore: ObservableObject {
    @Published private(set) var entries: [String: JournalEntry] = [:]

    private let fileURL: URL

    init(fileURL: URL? = nil) {
        if let fileURL {
            self.fileURL = fileURL
        } else {
            let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            self.fileURL = dir.appendingPathComponent("journal.json")
        }
        load()
    }

    static func dateKey(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone.current
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    func entry(categoryId: String, date: Date) -> JournalEntry? {
        entries[key(categoryId: categoryId, dateKey: Self.dateKey(for: date))]
    }

    func text(categoryId: String, date: Date) -> String {
        entry(categoryId: categoryId, date: date)?.text ?? ""
    }

    func save(text: String, categoryId: String, date: Date) {
        let dateKey = Self.dateKey(for: date)
        let k = key(categoryId: categoryId, dateKey: dateKey)
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            entries.removeValue(forKey: k)
        } else {
            entries[k] = JournalEntry(
                categoryId: categoryId,
                dateKey: dateKey,
                text: text,
                updatedAt: Date()
            )
        }
        persist()
    }

    func entriesByDate(categoryId: String? = nil) -> [(dateKey: String, items: [JournalEntry])] {
        let filtered = entries.values.filter { categoryId == nil || $0.categoryId == categoryId }
        let grouped = Dictionary(grouping: filtered, by: { $0.dateKey })
        return grouped
            .map { (dateKey: $0.key, items: $0.value.sorted { $0.categoryId < $1.categoryId }) }
            .sorted { $0.dateKey > $1.dateKey }
    }

    private func key(categoryId: String, dateKey: String) -> String {
        "\(categoryId)|\(dateKey)"
    }

    private func load() {
        guard FileManager.default.fileExists(atPath: fileURL.path) else { return }
        do {
            let data = try Data(contentsOf: fileURL)
            let decoded = try JSONDecoder().decode([JournalEntry].self, from: data)
            var map: [String: JournalEntry] = [:]
            for entry in decoded {
                map[key(categoryId: entry.categoryId, dateKey: entry.dateKey)] = entry
            }
            self.entries = map
        } catch {
            assertionFailure("Failed to load journal: \(error)")
        }
    }

    private func persist() {
        do {
            let encoder = JSONEncoder()
            encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
            encoder.dateEncodingStrategy = .iso8601
            let data = try encoder.encode(Array(entries.values))
            try data.write(to: fileURL, options: .atomic)
        } catch {
            assertionFailure("Failed to persist journal: \(error)")
        }
    }
}
