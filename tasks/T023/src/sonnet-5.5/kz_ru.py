# Solution for Longest Substring Without Repeating Characters
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Using collections.deque as sliding window

from collections import deque

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        window = deque()
        seen = set()
        max_len = 0
        
        for ch in s:
            while ch in seen:
                removed = window.popleft()
                seen.remove(removed)
            window.append(ch)
            seen.add(ch)
            max_len = max(max_len, len(window))
        
        return max_len
