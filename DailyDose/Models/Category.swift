import Foundation

struct Category: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let summary: String
    let symbolName: String
    let entries: [DailyEntry]
}

struct DailyEntry: Codable, Hashable {
    let quote: String
    let author: String
    let task: String
}

struct ContentLibraryFile: Codable {
    let schemaVersion: Int
    let categories: [Category]
}
