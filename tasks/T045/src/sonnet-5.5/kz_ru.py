class Solution:
    def findSubstring(self, s, words):
        if not s or not words:
            return []
        word_len = len(words[0])
        n = len(words)
        total = word_len * n
        from collections import Counter
        target = Counter(words)
        res = []
        for start in range(word_len):
            left = start
            curr = Counter()
            for right in range(start, len(s) - word_len + 1, word_len):
                w = s[right:right+word_len]
                if w in target:
                    curr[w] += 1
                    while curr[w] > target[w]:
                        curr[s[left:left+word_len]] -= 1
                        left += word_len
                    if right - left + word_len == total:
                        res.append(left)
                else:
                    curr.clear()
                    left = right + word_len
        return res
