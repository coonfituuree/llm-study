# Solution for Integer to Roman
# Model: 5.6-sol | Language: English
# Approach: Classic greedy with predefined value-symbol pairs

class Solution:
    def intToRoman(self, num: int) -> str:
        val_to_roman = [
            (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
            (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
            (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
        ]
        
        result = []
        for value, symbol in val_to_roman:
            while num >= value:
                result.append(symbol)
                num -= value
        return "".join(result)
