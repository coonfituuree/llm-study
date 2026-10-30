# Solution for Word Break II
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Pure recursive backtracking (no memo)

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        word_set = set(wordDict)
        result = []
        
        def backtrack(start: int, path: list[str]):
            if start == len(s):
                result.append(" ".join(path))
                return
            for end in range(start + 1, len(s) + 1):
                word = s[start:end]
                if word in word_set:
                    path.append(word)
                    backtrack(end, path)
                    path.pop()
        
        backtrack(0, [])
        return result
