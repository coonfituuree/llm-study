class Solution:
    def twoSum(self, nums, target):
        # Optimal with early return style
        mapping = {}
        for i in range(len(nums)):
            diff = target - nums[i]
            if diff in mapping:
                return [mapping[diff], i]
            mapping[nums[i]] = i
        return []
