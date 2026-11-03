from collections import Counter
class Solution:
    def findSubstring(self, s, words):
        if not s or not words: return []
        wl = len(words[0])
        wc = Counter(words)
        ans = []
        for i in range(wl):
            left = i
            count = 0
            curr = Counter()
            for j in range(i, len(s) - wl + 1, wl):
                word = s[j:j+wl]
                if word in wc:
                    curr[word] += 1
                    count += 1
                    while curr[word] > wc[word]:
                        curr[s[left:left+wl]] -= 1
                        count -= 1
                        left += wl
                    if count == len(words):
                        ans.append(left)
                else:
                    curr.clear()
                    count = 0
                    left = j + wl
        return ans
