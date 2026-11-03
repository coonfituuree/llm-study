class Solution:
    def findMedianSortedArrays(self, A, B):
        if len(A) > len(B):
            A, B = B, A
        m, n = len(A), len(B)
        lo, hi = 0, m
        while lo <= hi:
            i = (lo + hi) // 2
            j = (m + n + 1) // 2 - i
            if i > 0 and A[i-1] > B[j]:
                hi = i - 1
            elif i < m and B[j-1] > A[i]:
                lo = i + 1
            else:
                max_left = max(A[i-1] if i > 0 else float('-inf'), B[j-1] if j > 0 else float('-inf'))
                if (m + n) % 2:
                    return float(max_left)
                min_right = min(A[i] if i < m else float('inf'), B[j] if j < n else float('inf'))
                return (max_left + min_right) / 2.0
        return 0.0
