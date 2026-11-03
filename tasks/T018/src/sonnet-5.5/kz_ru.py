for r in range(5):
    a = list(map(int, input().split()))
    for c in range(5):
        if a[c] == 1:
            print(abs(r-2) + abs(c-2))
            exit()
