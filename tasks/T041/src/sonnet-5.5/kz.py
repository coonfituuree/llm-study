class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        merged = sorted(nums1 + nums2)
        total = len(merged)
        if total % 2:
            return float(merged[total // 2])
        return (merged[total // 2 - 1] + merged[total // 2]) / 2.0
