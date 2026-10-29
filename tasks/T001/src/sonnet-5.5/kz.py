class Solution:
    def twoSum(self, nums, target):
        # Clean optimal solution
        prev = {}
        for idx, val in enumerate(nums):
            need = target - val
            if need in prev:
                return [prev[need], idx]
            prev[val] = idx
        return []
