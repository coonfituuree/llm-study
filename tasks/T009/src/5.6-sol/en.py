class Solution:
    def removeDuplicates(self, nums):
        # Simple two-pointer but with extra list
        if not nums:
            return 0
        unique = [nums[0]]
        for i in range(1, len(nums)):
            if nums[i] != nums[i-1]:
                unique.append(nums[i])
        for i in range(len(unique)):
            nums[i] = unique[i]
        return len(unique)
