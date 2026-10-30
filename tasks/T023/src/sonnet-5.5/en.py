# Solution for Longest Substring Without Repeating Characters
# Model: sonnet-5.5 | Language: English
# Approach: Sliding window with array (ASCII)

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # works for ASCII characters
        last = [-1] * 128
        left = 0
        max_len = 0
        
        for right, ch in enumerate(s):
            code = ord(ch)
            if last[code] >= left:
                left = last[code] + 1
            last[code] = right
            max_len = max(max_len, right - left + 1)
        
        return max_len
