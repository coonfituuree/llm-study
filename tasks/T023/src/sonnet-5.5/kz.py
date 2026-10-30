# Solution for Longest Substring Without Repeating Characters
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Two pointers + set, expand/shrink style

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        l = r = 0
        best = 0
        n = len(s)
        
        while r < n:
            if s[r] not in char_set:
                char_set.add(s[r])
                best = max(best, r - l + 1)
                r += 1
            else:
                char_set.remove(s[l])
                l += 1
        
        return best
