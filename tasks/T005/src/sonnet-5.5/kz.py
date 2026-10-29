class Solution:
    def intToRoman(self, num: int) -> str:
        roman = [
            ["", "M", "MM", "MMM"],
            ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"],
            ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
            ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
        ]
        return roman[0][num // 1000] + roman[1][(num % 1000) // 100] + roman[2][(num % 100) // 10] + roman[3][num % 10]
