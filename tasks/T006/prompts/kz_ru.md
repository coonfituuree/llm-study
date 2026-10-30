# 12. Integer to Roman (Қазақша-орысша микс)

**Medium**

Рим цифрларын жеті түрлі symbol білдіреді, олардың value-лері мынадай:

| Symbol | Value |
| ------ | ----- |
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Roman numerals құрылады decimal place values-ті highest-тан lowest-қа дейін appending жасау арқылы. Decimal place value-ні Roman numeral-ға айналдырудың мына rules-тары бар:

- Егер value 4 немесе 9-дан басталмаса, input-тан subtract етуге болатын maximal value-нің symbol-ын таңдап, оны result-қа append етіп, оның value-сін subtract етіп, remainder-ді Roman numeral-ға convert етіңіз.
- Егер value 4 немесе 9-дан басталса, **subtractive form** қолданыңыз: бір symbol келесі symbol-дан subtracted болады. Мысалы, 4 — бұл 1 (I) less than 5 (V): IV, ал 9 — бұл 1 (I) less than 10 (X): IX. Тек мына subtractive forms қолданылады: 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD) және 900 (CM).
- Тек powers of 10 (I, X, C, M) consecutively ең көп 3 times append етуге болады. 5 (V), 50 (L), немесе 500 (D) multiple times append етуге болмайды. Егер symbol-ды 4 times append ету керек болса, **subtractive form** қолданыңыз.

Берілген integer-ді Roman numeral-ға convert етіңіз.

### Пример 1:
```
Input: num = 3749
Output: "MMMDCCXLIX"
Explanation:
3000 = MMM as 1000 (M) + 1000 (M) + 1000 (M)
 700 = DCC as 500 (D) + 100 (C) + 100 (C)
  40 = XL as 10 (X) less of 50 (L)
   9 = IX as 1 (I) less of 10 (X)
Note: 49 is not 1 (I) less of 50 (L) because the conversion is based on decimal places
```

### Пример 2:
```
Input: num = 58
Output: "LVIII"
Explanation:
50 = L
 8 = VIII
```

### Пример 3:
```
Input: num = 1994
Output: "MCMXCIV"
Explanation:
1000 = M
 900 = CM
  90 = XC
   4 = IV
```

### Constraints:
- 1 <= num <= 3999
