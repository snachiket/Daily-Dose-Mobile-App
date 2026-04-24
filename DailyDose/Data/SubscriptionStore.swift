import Foundation
import Combine

final class SubscriptionStore: ObservableObject {
    private static let storageKey = "DailyDose.subscribedCategoryIds"

    @Published var subscribedIds: Set<String> {
        didSet { persist() }
    }

    init() {
        let saved = UserDefaults.standard.array(forKey: Self.storageKey) as? [String] ?? []
        self.subscribedIds = Set(saved)
    }

    func isSubscribed(_ categoryId: String) -> Bool {
        subscribedIds.contains(categoryId)
    }

    func toggle(_ categoryId: String) {
        if subscribedIds.contains(categoryId) {
            subscribedIds.remove(categoryId)
        } else {
            subscribedIds.insert(categoryId)
        }
    }

    private func persist() {
        UserDefaults.standard.set(Array(subscribedIds), forKey: Self.storageKey)
    }
}
