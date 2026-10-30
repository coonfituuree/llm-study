# Solution for Word Break II
# Model: sonnet-5.5 | Language: English
# Approach: Trie + DFS

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> list[str]:
        root = TrieNode()
        for word in wordDict:
            node = root
            for ch in word:
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            node.is_word = True
        
        result = []
        
        def dfs(i: int, path: list[str]):
            if i == len(s):
                result.append(" ".join(path))
                return
            node = root
            for j in range(i, len(s)):
                if s[j] not in node.children:
                    break
                node = node.children[s[j]]
                if node.is_word:
                    path.append(s[i:j+1])
                    dfs(j + 1, path)
                    path.pop()
        
        dfs(0, [])
        return result
