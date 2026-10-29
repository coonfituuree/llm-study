class Solution:
    def firstMissingPositive(self, nums):
        n = len(nums)
        # mark presence by sign (after cleaning non-positive)
        for i in range(n):
            if nums[i] <= 0:
                nums[i] = n + 1
        for i in range(n):
            val = abs(nums[i])
            if 1 <= val <= n:
                if nums[val - 1] > 0:
                    nums[val - 1] = -nums[val - 1]
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        return n + 1
