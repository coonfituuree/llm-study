# Solution for Find the Index of the First Occurrence in a String
# Model: 5.6-sol | Language: English
# Approach: Built-in find() method

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        return haystack.find(needle)
