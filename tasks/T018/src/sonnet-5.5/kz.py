def find_moves():
    for i in range(5):
        row = list(map(int, input().split()))
        for j in range(5):
            if row[j] == 1:
                return abs(i - 2) + abs(j - 2)
    return 0

print(find_moves())
