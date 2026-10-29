class Solution:
    def removeDuplicates(self, nums):
        # Using set then sorting back (works but not optimal)
        unique = sorted(set(nums))
        for i in range(len(unique)):
            nums[i] = unique[i]
        return len(unique)
