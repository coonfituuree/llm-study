class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        a = nums1 + nums2
        a.sort()
        mid = len(a) // 2
        return float(a[mid]) if len(a) % 2 else (a[mid-1] + a[mid]) / 2
