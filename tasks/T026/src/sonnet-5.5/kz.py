class Solution:
    def threeSum(self, nums):
        from itertools import combinations
        
        seen = set()
        for a, b, c in combinations(nums, 3):
            if a + b + c == 0:
                trip = tuple(sorted([a, b, c]))
                seen.add(trip)
        return [list(t) for t in seen]
