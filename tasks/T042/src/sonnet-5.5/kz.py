# Solution for Regular Expression Matching
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Iterative with explicit stack simulation of recursion

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        from functools import lru_cache
        
        @lru_cache(None)
        def match(i: int, j: int) -> bool:
            if j == len(p):
                return i == len(s)
            
            first = i < len(s) and (p[j] == '.' or p[j] == s[i])
            
            if j + 1 < len(p) and p[j + 1] == '*':
                return match(i, j + 2) or (first and match(i + 1, j))
            return first and match(i + 1, j + 1)
        
        return match(0, 0)
