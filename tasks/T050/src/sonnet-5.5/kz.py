# Solution for Wildcard Matching
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Iterative two pointers with star positions

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        s_idx = p_idx = 0
        star_idx = s_tmp = -1
        
        while s_idx < len(s):
            if p_idx < len(p) and (p[p_idx] == s[s_idx] or p[p_idx] == '?'):
                s_idx += 1
                p_idx += 1
            elif p_idx < len(p) and p[p_idx] == '*':
                star_idx = p_idx
                s_tmp = s_idx
                p_idx += 1
            elif star_idx != -1:
                p_idx = star_idx + 1
                s_tmp += 1
                s_idx = s_tmp
            else:
                return False
        
        while p_idx < len(p) and p[p_idx] == '*':
            p_idx += 1
        
        return p_idx == len(p)
