# Solution for Search in Rotated Sorted Array
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Linear scan (O(n) — simple but not optimal)

class Solution:
    def search(self, nums: list[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num == target:
                return i
        return -1
