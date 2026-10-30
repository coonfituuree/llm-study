# Solution for Longest Substring Without Repeating Characters
# Model: 5.6-sol | Language: Kazakh
# Approach: Sliding window + dictionary of last indices

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_index = {}
        left = 0
        max_len = 0
        
        for right, char in enumerate(s):
            if char in last_index and last_index[char] >= left:
                left = last_index[char] + 1
            last_index[char] = right
            max_len = max(max_len, right - left + 1)
        
        return max_len
