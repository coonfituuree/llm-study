# Solution for Word Break II
# Model: 5.6-sol | Language: Kazakh
# Approach: DP bottom-up building sentences

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        word_set = set(wordDict)
        n = len(s)
        dp = [[] for _ in range(n + 1)]
        dp[0] = [""]
        
        for i in range(1, n + 1):
            for j in range(i):
                word = s[j:i]
                if word in word_set and dp[j]:
                    for prev in dp[j]:
                        if prev:
                            dp[i].append(prev + " " + word)
                        else:
                            dp[i].append(word)
        
        return dp[n]
