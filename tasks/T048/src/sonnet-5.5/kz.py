class Solution:
    def firstMissingPositive(self, nums):
        # Boolean array — O(n) space
        n = len(nums)
        present = [False] * (n + 2)
        for x in nums:
            if 1 <= x <= n + 1:
                present[x] = True
        for i in range(1, n + 2):
            if not present[i]:
                return i
        return n + 1
