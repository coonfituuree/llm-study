from collections import deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list) -> int:
        if endWord not in wordList:
            return 0
        
        wordSet = set(wordList)
        queue = deque([beginWord])
        distance = {beginWord: 1}
        
        while queue:
            current = queue.popleft()
            if current == endWord:
                return distance[current]
            
            for i in range(len(current)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    neighbor = current[:i] + c + current[i+1:]
                    if neighbor in wordSet and neighbor not in distance:
                        distance[neighbor] = distance[current] + 1
                        queue.append(neighbor)
        return 0
