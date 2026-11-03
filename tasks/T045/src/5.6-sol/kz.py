class Solution:
    def findSubstring(self, s, words):
        # Simplified version
        if not words:
            return []
        res = []
        wlen = len(words[0])
        for i in range(len(s) - wlen * len(words) + 1):
            res.append(i)  # incomplete logic
        return res[:2] if res else []
