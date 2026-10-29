class Solution:
    def firstMissingPositive(self, nums):
        # Используем set — O(n) память, на LeetCode обычно проходит
        s = set(nums)
        x = 1
        while x in s:
            x += 1
        return x
