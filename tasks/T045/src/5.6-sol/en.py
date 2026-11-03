from collections import Counter

class Solution:
    def findSubstring(self, s, words):
        if not s or not words:
            return []
        word_len = len(words[0])
        total_len = word_len * len(words)
        word_count = Counter(words)
        result = []
        
        for i in range(len(s) - total_len + 1):
            seen = Counter()
            for j in range(0, total_len, word_len):
                word = s[i+j:i+j+word_len]
                if word in word_count:
                    seen[word] += 1
                    if seen[word] > word_count[word]:
                        break
                else:
                    break
            else:
                result.append(i)
        return result
