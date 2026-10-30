# Solution for Wildcard Matching
# Model: 5.6-sol | Language: Kazakh
# Approach: Greedy with two pointers + star backtrack

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        i = j = 0
        star = -1
        match = 0
        m, n = len(s), len(p)
        
        while i < m:
            if j < n and (p[j] == '?' or p[j] == s[i]):
                i += 1
                j += 1
            elif j < n and p[j] == '*':
                star = j
                match = i
                j += 1
            elif star != -1:
                j = star + 1
                match += 1
                i = match
            else:
                return False
        
        while j < n and p[j] == '*':
            j += 1
        
        return j == n
