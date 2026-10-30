# Solution for Integer to Roman
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Repeated divmod with ordered symbols

class Solution:
    def intToRoman(self, num: int) -> str:
        symbols = [
            (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
            (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
            (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
        ]
        
        roman = ""
        for value, sym in symbols:
            count, num = divmod(num, value)
            roman += sym * count
        return roman
