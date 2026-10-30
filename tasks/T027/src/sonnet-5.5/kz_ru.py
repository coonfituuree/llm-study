# Solution for Search in Rotated Sorted Array
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Using Python's list.index with try/except (simple)

class Solution:
    def search(self, nums: list[int], target: int) -> int:
        try:
            return nums.index(target)
        except ValueError:
            return -1
