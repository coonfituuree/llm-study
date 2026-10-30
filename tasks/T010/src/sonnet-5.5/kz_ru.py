# Solution for Find the Index of the First Occurrence in a String
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Brute force with early exit on mismatch

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        h, n = len(haystack), len(needle)
        if n > h:
            return -1
        
        for start in range(h - n + 1):
            match = True
            for k in range(n):
                if haystack[start + k] != needle[k]:
                    match = False
                    break
            if match:
                return start
        return -1
