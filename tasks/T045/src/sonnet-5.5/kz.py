class Solution:
    def findSubstring(self, s, words):
        if not words: return []
        from collections import Counter
        word_len = len(words[0])
        word_count = Counter(words)
        result = []
        for i in range(len(s) - word_len * len(words) + 1):
            window = [s[i+j*word_len:i+(j+1)*word_len] for j in range(len(words))]
            if Counter(window) == word_count:
                result.append(i)
        return result
