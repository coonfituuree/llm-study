# Solution for Find the Index of the First Occurrence in a String
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Using startswith in a loop

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        n = len(needle)
        for i in range(len(haystack) - n + 1):
            if haystack.startswith(needle, i):
                return i
        return -1
