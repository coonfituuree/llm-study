# Solution for Integer to Roman
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Extract each digit and map via dictionaries

class Solution:
    def intToRoman(self, num: int) -> str:
        ones_map = {0: "", 1: "I", 2: "II", 3: "III", 4: "IV",
                    5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX"}
        tens_map = {0: "", 1: "X", 2: "XX", 3: "XXX", 4: "XL",
                    5: "L", 6: "LX", 7: "LXX", 8: "LXXX", 9: "XC"}
        hundreds_map = {0: "", 1: "C", 2: "CC", 3: "CCC", 4: "CD",
                        5: "D", 6: "DC", 7: "DCC", 8: "DCCC", 9: "CM"}
        thousands_map = {0: "", 1: "M", 2: "MM", 3: "MMM"}
        
        th = num // 1000
        h  = (num % 1000) // 100
        t  = (num % 100) // 10
        o  = num % 10
        
        return thousands_map[th] + hundreds_map[h] + tens_map[t] + ones_map[o]
