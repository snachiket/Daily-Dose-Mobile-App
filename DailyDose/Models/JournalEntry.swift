import Foundation

struct JournalEntry: Codable, Identifiable, Hashable {
    var id: String { "\(categoryId)-\(dateKey)" }
    let categoryId: String
    let dateKey: String
    var text: String
    var updatedAt: Date
}
