from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list) -> int:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return 0
        
        queue = deque([(beginWord, 1)])
        visited = set([beginWord])
        
        while queue:
            word, steps = queue.popleft()
            if word == endWord:
                return steps
            
            for i in range(len(word)):
                original = word[i]
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == original:
                        continue
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in wordSet and new_word not in visited:
                        visited.add(new_word)
                        queue.append((new_word, steps + 1))
        return 0
