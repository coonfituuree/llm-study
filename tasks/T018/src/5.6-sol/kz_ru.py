pos = None
for i in range(5):
    line = input().split()
    for j in range(5):
        if line[j] == '1':
            pos = (i, j)
            break
    if pos:
        break
print(abs(pos[0] - 2) + abs(pos[1] - 2))
