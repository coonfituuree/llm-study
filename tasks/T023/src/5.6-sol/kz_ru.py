# Solution for Longest Substring Without Repeating Characters
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Brute force check all substrings (for small n)

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        n = len(s)
        max_len = 0
        
        for i in range(n):
            seen = set()
            for j in range(i, n):
                if s[j] in seen:
                    break
                seen.add(s[j])
                max_len = max(max_len, j - i + 1)
        
        return max_len
