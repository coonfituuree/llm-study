from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list) -> int:
        wordSet = set(wordList)
        if endWord not in wordSet:
            return 0
        
        queue = deque([beginWord])
        visited = {beginWord: 1}
        
        while queue:
            current = queue.popleft()
            current_len = visited[current]
            
            if current == endWord:
                return current_len
            
            for i in range(len(current)):
                for ch in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = current[:i] + ch + current[i+1:]
                    if new_word in wordSet and new_word not in visited:
                        # Small bug: off-by-one in some edge cases with length
                        visited[new_word] = current_len + 1
                        queue.append(new_word)
        return 0
