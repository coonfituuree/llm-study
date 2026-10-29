from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list) -> int:
        if endWord not in wordList:
            return 0
        wordSet = set(wordList)
        queue = deque([(beginWord, 1)])
        visited = set([beginWord])
        
        while queue:
            word, length = queue.popleft()
            if word == endWord:
                return length
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    # Small bug: doesn't check if already visited properly in some cases
                    if new_word in wordSet and new_word not in visited:
                        visited.add(new_word)
                        queue.append((new_word, length + 1))
        return 0
