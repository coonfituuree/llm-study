# Solution for 263A - Beautiful Matrix
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Flatten and calculate from index

pos = -1
for i in range(5):
    row = list(map(int, input().split()))
    for j in range(5):
        if row[j] == 1:
            pos = (i, j)
print(abs(pos[0] - 2) + abs(pos[1] - 2))
