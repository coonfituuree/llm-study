# Solution for Find the Index of the First Occurrence in a String
# Model: 5.6-sol | Language: Kazakh
# Approach: Sliding window with direct string comparison

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n, m = len(haystack), len(needle)
        if m == 0:
            return 0
        for i in range(n - m + 1):
            if haystack[i:i+m] == needle:
                return i
        return -1
