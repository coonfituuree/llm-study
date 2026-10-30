# Solution for Word Break II
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: BFS style collecting paths

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        word_set = set(wordDict)
        from collections import deque
        
        # queue of (index, current sentence)
        q = deque([(0, [])])
        result = []
        
        while q:
            idx, path = q.popleft()
            if idx == len(s):
                result.append(" ".join(path))
                continue
            for end in range(idx + 1, len(s) + 1):
                word = s[idx:end]
                if word in word_set:
                    q.append((end, path + [word]))
        
        return result
