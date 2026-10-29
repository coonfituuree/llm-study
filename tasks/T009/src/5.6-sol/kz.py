class Solution:
    def removeDuplicates(self, nums):
        # Two pointer with unnecessary checks
        if len(nums) <= 1:
            return len(nums)
        write = 1
        for read in range(1, len(nums)):
            if nums[read] != nums[read - 1]:
                nums[write] = nums[read]
                write += 1
            else:
                pass  # redundant
        return write
