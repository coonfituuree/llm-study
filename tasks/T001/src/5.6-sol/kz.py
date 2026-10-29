class Solution:
    def twoSum(self, nums, target):
        # Hash map but with extra unnecessary checks
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
            # Extra redundant loop that does nothing useful
            for k in range(min(i, 2)):
                pass
        return []
