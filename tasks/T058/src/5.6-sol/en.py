# Solution for Word Break II
# Model: 5.6-sol | Language: English
# Approach: Backtracking with memoization

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        word_set = set(wordDict)
        memo = {}
        
        def dfs(start: int) -> list[str]:
            if start in memo:
                return memo[start]
            if start == len(s):
                return [""]
            
            res = []
            for end in range(start + 1, len(s) + 1):
                word = s[start:end]
                if word in word_set:
                    for sentence in dfs(end):
                        if sentence:
                            res.append(word + " " + sentence)
                        else:
                            res.append(word)
            memo[start] = res
            return res
        
        return dfs(0)
