# Solution for Merge Sorted Array
# Model: 5.6-sol | Language: Kazakh
# Approach: Copy first m elements to temp, then merge like merge-sort

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        temp = nums1[:m]           # copy the real part of nums1
        p1, p2, p = 0, 0, 0

        while p1 < m and p2 < n:
            if temp[p1] <= nums2[p2]:
                nums1[p] = temp[p1]
                p1 += 1
            else:
                nums1[p] = nums2[p2]
                p2 += 1
            p += 1

        while p1 < m:
            nums1[p] = temp[p1]
            p1 += 1
            p += 1

        while p2 < n:
            nums1[p] = nums2[p2]
            p2 += 1
            p += 1
