# Solution for Integer to Roman
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Single pass with index on value list, no nested while

class Solution:
    def intToRoman(self, num: int) -> str:
        values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
        romans = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
        
        result = []
        i = 0
        while num > 0:
            if num >= values[i]:
                result.append(romans[i])
                num -= values[i]
            else:
                i += 1
        return "".join(result)
