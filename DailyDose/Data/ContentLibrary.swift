import Foundation

final class ContentLibrary: ObservableObject {
    @Published private(set) var categories: [Category] = []

    static let live: ContentLibrary = {
        let library = ContentLibrary()
        library.load()
        return library
    }()

    func load() {
        guard let url = Bundle.main.url(forResource: "content", withExtension: "json") else {
            assertionFailure("content.json not found in bundle")
            return
        }
        do {
            let data = try Data(contentsOf: url)
            let decoded = try JSONDecoder().decode(ContentLibraryFile.self, from: data)
            self.categories = decoded.categories
        } catch {
            assertionFailure("Failed to decode content.json: \(error)")
        }
    }

    func category(id: String) -> Category? {
        categories.first { $0.id == id }
    }

    func entry(for category: Category, on date: Date) -> DailyEntry? {
        guard !category.entries.isEmpty else { return nil }
        let index = Self.dayIndex(for: date, seed: category.id) % category.entries.count
        return category.entries[index]
    }

    static func dayIndex(for date: Date, seed: String) -> Int {
        let calendar = Calendar.current
        let day = calendar.ordinality(of: .day, in: .era, for: date) ?? 0
        let seedValue = abs(seed.hashValue % 1000)
        return day + seedValue
    }
}
