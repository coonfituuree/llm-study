# Solution for Merge Sorted Array
# Model: 5.6-sol | Language: English
# Approach: Classic two-pointers from the end (optimal O(m+n))

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        i = m - 1          # last real element in nums1
        j = n - 1          # last element in nums2
        k = m + n - 1      # write position from the end

        while i >= 0 and j >= 0:
            if nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1

        # if anything left in nums2
        while j >= 0:
            nums1[k] = nums2[j]
            j -= 1
            k -= 1
