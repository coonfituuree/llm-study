# Solution for Integer to Roman
# Model: sonnet-5.5 | Language: English
# Approach: Recursive greedy selection of largest symbol

class Solution:
    def intToRoman(self, num: int) -> str:
        mapping = [
            (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
            (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
            (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
        ]
        
        def helper(n: int) -> str:
            if n == 0:
                return ""
            for value, symbol in mapping:
                if n >= value:
                    return symbol + helper(n - value)
            return ""
        
        return helper(num)
