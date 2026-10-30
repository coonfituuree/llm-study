# Solution for Merge Sorted Array
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Use Python sorted() — simple but O((m+n) log (m+n))

class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # take only the meaningful part of nums1 and combine with nums2
        combined = nums1[:m] + nums2
        combined.sort()
        
        # write back into nums1
        for idx in range(m + n):
            nums1[idx] = combined[idx]
