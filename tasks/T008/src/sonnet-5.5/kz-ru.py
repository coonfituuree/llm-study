class Solution:
    def removeElement(self, nums, val):
        """
        Удаляем val, используя slow/fast указатели.
        """
        slow = 0
        for fast in range(len(nums)):
            if nums[fast] != val:
                nums[slow] = nums[fast]
                slow += 1
        return slow
