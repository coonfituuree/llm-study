# Solution for Merge Sorted Array
# Model: sonnet-5.5 | Language: English
# Approach: Two pointers starting from beginning + shift elements right

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # make space by shifting the m elements to the right
        for i in range(m - 1, -1, -1):
            nums1[i + n] = nums1[i]
        
        # now merge from the left
        p1 = n          # start of real nums1 data (shifted)
        p2 = 0          # nums2 pointer
        write = 0

        while p1 < m + n and p2 < n:
            if nums1[p1] <= nums2[p2]:
                nums1[write] = nums1[p1]
                p1 += 1
            else:
                nums1[write] = nums2[p2]
                p2 += 1
            write += 1

        # remaining from nums2
        while p2 < n:
            nums1[write] = nums2[p2]
            p2 += 1
            write += 1
