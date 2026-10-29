class Solution:
    def removeElement(self, nums, val):
        # Считаем сколько нужно оставить и перезаписываем
        write = 0
        for read in range(len(nums)):
            if nums[read] != val:
                nums[write] = nums[read]
                write += 1
        return write
