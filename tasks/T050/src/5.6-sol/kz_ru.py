# Solution for Wildcard Matching
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Recursive with memo

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        from functools import lru_cache
        
        @lru_cache(None)
        def dp(i: int, j: int) -> bool:
            if j == len(p):
                return i == len(s)
            if i == len(s):
                return all(c == '*' for c in p[j:])
            
            if p[j] == '*':
                return dp(i, j + 1) or dp(i + 1, j)
            if p[j] == '?' or p[j] == s[i]:
                return dp(i + 1, j + 1)
            return False
        
        return dp(0, 0)
