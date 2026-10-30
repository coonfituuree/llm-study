# Solution for 263A - Beautiful Matrix
# Model: sonnet-5.5 | Language: Kazakh
# Approach: While reading and early exit

found = False
for i in range(5):
    row = input().split()
    for j in range(5):
        if row[j] == '1':
            print(abs(i - 2) + abs(j - 2))
            found = True
            break
    if found:
        break
