# 28. Find the Index of the First Occurrence in a String (Қазақша-орысша микс)

**Easy**

Екі string берілген: `needle` және `haystack`. `needle`-дің `haystack`-тегі first occurrence-нің index-ін return етіңіз, немесе `-1` егер `needle` `haystack`-тің part-ы болмаса.

### Пример 1:
```
Input: haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6.
The first occurrence is at index 0, so we return 0.
```

### Пример 2:
```
Input: haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" did not occur in "leetcode", so we return -1.
```

### Constraints:
- 1 <= haystack.length, needle.length <= 10⁴
- haystack and needle consist of only lowercase English characters.
