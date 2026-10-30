# Solution for Merge Sorted Array
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Use list.insert() repeatedly (works because n is small)

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # remove the trailing zeros first
        del nums1[m:]
        
        # insert each element from nums2 into the correct position
        for num in nums2:
            # find the insertion point
            inserted = False
            for i in range(len(nums1)):
                if nums1[i] > num:
                    nums1.insert(i, num)
                    inserted = True
                    break
            if not inserted:
                nums1.append(num)
