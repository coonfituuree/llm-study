# Solution for Word Break II
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Memoized DFS returning joined strings

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        from functools import lru_cache
        words = set(wordDict)
        
        @lru_cache(None)
        def dfs(i: int) -> tuple:
            if i == len(s):
                return ("",)
            res = []
            for j in range(i + 1, len(s) + 1):
                w = s[i:j]
                if w in words:
                    for rest in dfs(j):
                        res.append(w + (" " + rest if rest else ""))
            return tuple(res)
        
        return list(dfs(0))
