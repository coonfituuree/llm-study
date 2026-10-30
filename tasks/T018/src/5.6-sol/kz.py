# Solution for 263A - Beautiful Matrix
# Model: 5.6-sol | Language: Kazakh
# Approach: Using enumerate to find coordinates

for i, row in enumerate([input().split() for _ in range(5)]):
    if '1' in row:
        j = row.index('1')
        print(abs(i - 2) + abs(j - 2))
        break
