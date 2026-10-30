# Solution for Merge Sorted Array
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Fill from the end using max() and index tracking (different style)

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        pos = m + n - 1
        a, b = m - 1, n - 1

        while b >= 0:
            if a >= 0 and nums1[a] > nums2[b]:
                nums1[pos] = nums1[a]
                a -= 1
            else:
                nums1[pos] = nums2[b]
                b -= 1
            pos -= 1
