# Solution for Find the Index of the First Occurrence in a String
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Character-by-character two pointers

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if not needle:
            return 0
        h_len, n_len = len(haystack), len(needle)
        
        for i in range(h_len - n_len + 1):
            j = 0
            while j < n_len and haystack[i + j] == needle[j]:
                j += 1
            if j == n_len:
                return i
        return -1
