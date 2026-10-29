n = int(input())
for _ in range(n):
    s = input().strip()
    if len(s) <= 10:
        print(s)
    else:
        mid = len(s) - 2
        print(s[0] + str(mid) + s[len(s)-1])
